#!/bin/bash

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
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

# Fonction pour le mode watch (par défaut)
watch_kata() {
    local test_file="$1"
    local kata_name=$(get_kata_name "$test_file")
    local kata_dir=$(dirname "$test_file")
    local implementation_file="$kata_dir/index.ts"
    
    echo -e "${CYAN}👁️  Mode watch activé pour: $kata_name${NC}"
    echo -e "${YELLOW}Surveillance des fichiers (déclenchement à la sauvegarde):${NC}"
    echo -e "  📝 $implementation_file"
    echo -e "  🧪 $test_file"
    echo -e "${YELLOW}Sauvegardez vos fichiers pour relancer les tests automatiquement${NC}"
    echo -e "${YELLOW}Pressez Ctrl+C pour arrêter${NC}"
    echo

    # Fonction pour exécuter le test
    run_test() {
        clear
        echo -e "${CYAN}🔄 Sauvegarde détectée - Relancement du test...${NC}"
        echo -e "${BLUE}🏃 Test: $kata_name${NC}"
        echo "================================================"
        
        if NODE_OPTIONS='--no-warnings' npx mocha --loader=ts-node/esm --no-config --recursive false "$test_file"; then
            echo
            echo -e "${GREEN}✅ Test réussi!${NC}"
        else
            echo
            echo -e "${RED}❌ Test échoué - Modifiez votre code et sauvegardez...${NC}"
        fi
        echo
        echo -e "${YELLOW}En surveillance... (Sauvegardez pour relancer)${NC}"
    }

    # Premier run
    run_test

    # Surveillance avec fswatch en mode événements (détecte les sauvegardes)
    if command -v fswatch >/dev/null 2>&1; then
        # Utilise fswatch avec des événements spécifiques pour détecter les sauvegardes
        fswatch -1 -e ".*" -i "\\.ts$" "$kata_dir" | while read f; do
            # Attendre un peu pour s'assurer que la sauvegarde est complète
            sleep 0.2
            run_test
            # Relance fswatch pour le prochain événement
            exec "$0" "$test_file"
        done
    else
        echo -e "${YELLOW}⚠️  fswatch non installé, utilisation du mode polling optimisé${NC}"
        echo -e "${BLUE}💡 Installez fswatch avec: brew install fswatch (recommandé)${NC}"
        echo
        
        # Mode polling optimisé - vérifie seulement toutes les 0.5 secondes
        local last_mod_impl=$(stat -f %m "$implementation_file" 2>/dev/null || echo 0)
        local last_mod_test=$(stat -f %m "$test_file" 2>/dev/null || echo 0)
        
        while true; do
            sleep 0.5  # Vérifie toutes les 0.5 secondes
            local current_mod_impl=$(stat -f %m "$implementation_file" 2>/dev/null || echo 0)
            local current_mod_test=$(stat -f %m "$test_file" 2>/dev/null || echo 0)
            
            if [ "$current_mod_impl" != "$last_mod_impl" ] || [ "$current_mod_test" != "$last_mod_test" ]; then
                # Attendre un peu pour s'assurer que la sauvegarde est complète
                sleep 0.3
                run_test
                last_mod_impl="$current_mod_impl"
                last_mod_test="$current_mod_test"
            fi
        done
    fi
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
            echo -e "  ${GREEN}o${NC}. 🎯 Test unique (sans surveillance)"
            echo -e "  ${GREEN}b${NC}. ⬅️  Retour aux niveaux"
            echo -e "  ${GREEN}q${NC}. ❌ Quitter"
            echo
            
            # Demande le choix du kata
            read -p "Choisissez un kata (1-${#level_tests[@]} = watch, a, o, b, q): " kata_choice
            
            case $kata_choice in
                [1-9]*)
                    if [ "$kata_choice" -le "${#level_tests[@]}" ] && [ "$kata_choice" -gt 0 ]; then
                        selected_file="${level_tests[$((kata_choice-1))]}"
                        kata_name=$(get_kata_name "$selected_file")
                        echo -e "${BLUE}👁️  Mode watch pour: $kata_name${NC}"
                        echo
                        watch_kata "$selected_file"
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
                o|O)
                    echo -e "${YELLOW}Test unique - Choisissez un kata:${NC}"
                    echo
                    for i in "${!level_tests[@]}"; do
                        kata_name=$(get_kata_name "${level_tests[$i]}")
                        echo -e "  ${GREEN}$((i+1))${NC}. $kata_name"
                    done
                    echo
                    read -p "Quel kata tester une fois? (1-${#level_tests[@]}): " once_choice
                    if [ "$once_choice" -le "${#level_tests[@]}" ] && [ "$once_choice" -gt 0 ]; then
                        selected_file="${level_tests[$((once_choice-1))]}"
                        kata_name=$(get_kata_name "$selected_file")
                        echo -e "${BLUE}🏃 Test unique: $kata_name${NC}"
                        echo
                        NODE_OPTIONS='--no-warnings' npx mocha --loader=ts-node/esm --no-config --recursive false "$selected_file"
                    else
                        echo -e "${RED}❌ Choix invalide${NC}"
                        exit 1
                    fi
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
