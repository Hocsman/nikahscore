import os
import re

file_path = r'src\app\results\[pairId]\page.tsx'

# Lire le fichier
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Ajouter les imports
old_import = "import { ArrowLeft, Heart, Users, TrendingUp, AlertTriangle } from 'lucide-react'"
new_import = "import { ArrowLeft, Heart, Users, TrendingUp, AlertTriangle } from 'lucide-react'\nimport { ShareButtons } from '@/components/ShareButtons'\nimport { PersonalizedAdvice } from '@/components/PersonalizedAdvice'"

content = content.replace(old_import, new_import)

# Écrire le fichier
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(' Imports ajoutés avec succès!')
