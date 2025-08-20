#!/bin/bash

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Sélecteur de tests Codewars${NC}"
echo "=================================="

# Fonction pour extraire le niveau (1-kyu, 6-kyu, etc.)
get_level_from_path() {
    echo "$1" | sed 's|src/katas/||' | sed 's|/.*||'
}

# Fonction pour extraire le nom du kata
get_kata_name() {
    echo "$1" | sed 's|src/katas/[^/]*/||' | sed 's|/index.test.ts||' | sed 's|-| |g'
}

# Trouve tous les fichiers de test
test_files=($(find src/katas -name "*.test.ts" | sort))

if [ ${#test_files[@]} -eq 0 ]; then
    echo -e "${RED}❌ Aucun fichier de test trouvé${NC}"
    exit 1
fi

# Extrait les niveaux uniques
level_list=""
for file in "${test_files[@]}"; do
    level=$(get_level_from_path "$file")
    if [[ "$level_list" != *"$level"* ]]; then
        level_list="$level $level_list"
    fi
done

# Convertit en array trié
level_array=($(echo "$level_list" | tr ' ' '\n' | sort | tr '\n' ' '))

echo -e "${YELLOW}Niveaux disponibles :${NC}"
echo

# Affiche la liste des niveaux
for i in "${!level_array[@]}"; do
    echo -e "  ${GREEN}$((i+1))${NC}. ${level_array[$i]}"
done

echo
echo -e "  ${GREEN}a${NC}. 🚀 Lancer tous les tests"
echo -e "  ${GREEN}q${NC}. ❌ Quitter"
echo

# Demande le choix du niveau
read -p "Choisissez un niveau (1-${#level_array[@]}, a, q): " level_choice

case $level_choice in
    [1-9]*)
        if [ "$level_choice" -le "${#level_array[@]}" ] && [ "$level_choice" -gt 0 ]; then
            selected_level="${level_array[$((level_choice-1))]}"
            
            # Filtre les tests pour ce niveau
            level_tests=()
            for file in "${test_files[@]}"; do
                if [[ "$file" == *"$selected_level"* ]]; then
                    level_tests+=("$file")
                fi
            done
            
            echo
            echo -e "${MAGENTA}📁 Niveau: $selected_level${NC}"
            echo -e "${YELLOW}Katas disponibles :${NC}"
            echo
            
            # Affiche les katas de ce niveau
            for i in "${!level_tests[@]}"; do
                kata_name=$(get_kata_name "${level_tests[$i]}")
                echo -e "  ${GREEN}$((i+1))${NC}. $kata_name"
            done
            
            echo
            echo -e "  ${GREEN}a${NC}. 🚀 Lancer tous les tests de ce niveau"
            echo -e "  ${GREEN}b${NC}. ⬅️  Retour aux niveaux"
            echo -e "  ${GREEN}q${NC}. ❌ Quitter"
            echo
            
            # Demande le choix du kata
            read -p "Choisissez un kata (1-${#level_tests[@]}, a, b, q): " kata_choice
            
            case $kata_choice in
                [1-9]*)
                    if [ "$kata_choice" -le "${#level_tests[@]}" ] && [ "$kata_choice" -gt 0 ]; then
                        selected_file="${level_tests[$((kata_choice-1))]}"
                        kata_name=$(get_kata_name "$selected_file")
                        echo -e "${BLUE}🏃 Lancement du test: $kata_name${NC}"
                        echo
                        NODE_OPTIONS='--no-warnings' npx mocha --loader=ts-node/esm --no-config --recursive false "$selected_file"
                    else
                        echo -e "${RED}❌ Choix invalide${NC}"
                        exit 1
                    fi
                    ;;
                a|A)
                    echo -e "${BLUE}🚀 Lancement de tous les tests du niveau $selected_level${NC}"
                    echo
                    for file in "${level_tests[@]}"; do
                        kata_name=$(get_kata_name "$file")
                        echo -e "${MAGENTA}🧪 Test: $kata_name${NC}"
                        NODE_OPTIONS='--no-warnings' npx mocha --loader=ts-node/esm --no-config --recursive false "$file"
                        echo
                    done
                    ;;
                b|B)
                    exec "$0" # Relance le script
                    ;;
                q|Q)
                    echo -e "${YELLOW}👋 Au revoir !${NC}"
                    exit 0
                    ;;
                *)
                    echo -e "${RED}❌ Choix invalide${NC}"
                    exit 1
                    ;;
            esac
        else
            echo -e "${RED}❌ Choix invalide${NC}"
            exit 1
        fi
        ;;
    a|A)
        echo -e "${BLUE}🚀 Lancement de tous les tests${NC}"
        echo
        for file in "${test_files[@]}"; do
            kata_name=$(get_kata_name "$file")
            echo -e "${MAGENTA}🧪 Test: $kata_name${NC}"
            NODE_OPTIONS='--no-warnings' npx mocha --loader=ts-node/esm --no-config --recursive true "$file"
            echo
        done
        ;;
    q|Q)
        echo -e "${YELLOW}👋 Au revoir !${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Choix invalide${NC}"
        exit 1
        ;;
esac
