import os
from bs4 import BeautifulSoup
import re

def analyser_composition_html(source_html, est_fichier=False):
    """
    Analyse le pourcentage de CSS et JS embarqué dans du HTML.
    
    Args:
        source_html (str): Le code HTML ou le chemin du fichier.
        est_fichier (bool): True si source_html est un chemin de fichier.
    """
    
    # 1. Chargement du HTML
    html_content = ""
    if est_fichier:
        if not os.path.exists(source_html):
            return "Erreur : Le fichier n'existe pas."
        with open(source_html, 'r', encoding='utf-8') as f:
            html_content = f.read()
    else:
        html_content = source_html

    total_chars = len(html_content)
    if total_chars == 0:
        return "Erreur : Le contenu HTML est vide."

    soup = BeautifulSoup(html_content, 'html.parser')

    # --- ANALYSE CSS ---
    css_count = 0
    
    # Compter le contenu des balises <style>
    for style_tag in soup.find_all('style'):
        if style_tag.string:
            css_count += len(style_tag.string)
            
    # Compter les attributs inline style="..."
    # soup.find_all(True) trouve toutes les balises
    for tag in soup.find_all(True):
        if 'style' in tag.attrs:
            # tag.attrs['style'] peut être une liste ou une string selon le parseur
            style_val = tag.attrs['style']
            if isinstance(style_val, list):
                css_count += len(" ".join(style_val))
            else:
                css_count += len(str(style_val))

    # --- ANALYSE JS ---
    js_count = 0
    
    # Compter le contenu des balises <script> (seulement code interne, pas src externe)
    for script_tag in soup.find_all('script'):
        if not script_tag.get('src') and script_tag.string:
            js_count += len(script_tag.string)

    # Compter les événements inline (onclick, onmouseover, etc.)
    # On cherche tous les attributs commençant par 'on'
    for tag in soup.find_all(True):
        for attr in tag.attrs:
            if attr.lower().startswith('on'):
                val = tag.attrs[attr]
                if isinstance(val, list):
                    js_count += len(" ".join(val))
                else:
                    js_count += len(str(val))

    # --- CALCULS ---
    # Le HTML pur est ce qui reste (approximatif, car on compte les caractères bruts)
    # Note : Cela considère les balises <style>...</style> comme faisant partie du poids "total" du fichier
    
    percent_css = (css_count / total_chars) * 100
    percent_js = (js_count / total_chars) * 100
    percent_html = 100 - (percent_css + percent_js)

    return {
        "total_size": total_chars,
        "css_size": css_count,
        "js_size": js_count,
        "css_percent": round(percent_css, 2),
        "js_percent": round(percent_js, 2),
        "html_structure_percent": round(percent_html, 2)
    }

# --- EXEMPLE D'UTILISATION ---

# --- EXEMPLE AVEC UN FICHIER ---

# Remplacez ceci par le chemin réel de votre fichier
# Sur Windows, utilisez des doubles anti-slashs (\\) ou des slashs simples (/)
mon_fichier = "pages/contact.html"

# On appelle la fonction en précisant est_fichier=True
resultats = analyser_composition_html(mon_fichier, est_fichier=True)

# On vérifie si le retour est un dictionnaire (succès) ou une string (erreur)
if isinstance(resultats, dict):
    print("-" * 30)
    print(f"ANALYSE DU FICHIER : {os.path.basename(mon_fichier)}")
    print("-" * 30)
    print(f"Taille totale : {resultats['total_size']} caractères")
    print(f"CSS (Code & Inline) : {resultats['css_percent']}%")
    print(f"JS (Scripts & Events): {resultats['js_percent']}%")
    print(f"Structure HTML      : {resultats['html_structure_percent']}%")
else:
    # Si c'est une erreur (ex: fichier introuvable)
    print(resultats)
    
    