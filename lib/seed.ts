import { db } from "./db";

/** Données d'exemple pour tester l'application */
export async function seedSampleData() {
  const existing = await db.lessons.count();
  if (existing > 0) return { seeded: false, message: "Des données existent déjà" };

  const now = Date.now();

  // Leçons d'exemple
  const lessons = [
    {
      subject: "maths",
      title: "Équations du premier degré",
      content: `Une équation du premier degré à une inconnue est de la forme :
ax + b = 0  (avec a ≠ 0)

Méthode de résolution :
1. Isoler les termes en x d'un côté
2. Isoler les constantes de l'autre côté
3. Diviser par le coefficient de x

Exemple :
3x + 6 = 15
3x = 15 - 6
3x = 9
x = 3

Propriétés :
- On peut ajouter ou soustraire le même nombre des deux côtés
- On peut multiplier ou diviser les deux côtés par le même nombre non nul`,
      mastered: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      subject: "maths",
      title: "Théorème de Pythagore",
      content: `Dans un triangle rectangle, le carré de l'hypothénuse est égal à la somme des carrés des deux autres côtés.

Formule : a² + b² = c²
où c est l'hypothénuse (le plus grand côté).

Exemple :
Si a = 3 et b = 4, alors c = √(9+16) = √25 = 5

Réciproque : Si a² + b² = c², alors le triangle est rectangle en C.`,
      mastered: false,
      createdAt: now - 1000,
      updatedAt: now - 1000,
    },
    {
      subject: "physique",
      title: "Les forces",
      content: `Une force est une action mécanique capable de :
- Mettre un corps en mouvement
- Modifier un mouvement
- Déformer un corps

Caractéristiques d'une force :
- Point d'application
- Direction
- Sens
- Intensité (en Newton, N)

Types de forces :
- Force de gravitation (poids P = m × g)
- Force élastique
- Force de frottement
- Force électromagnétique

Représentation : vecteur (flèche)`,
      mastered: false,
      createdAt: now - 2000,
      updatedAt: now - 2000,
    },
    {
      subject: "svt",
      title: "La photosynthèse",
      content: `La photosynthèse est le processus par lequel les plantes vertes fabriquent leur propre matière organique à partir de :
- Dioxyde de carbone (CO₂)
- Eau (H₂O)
- Énergie lumineuse (soleil)

Équation simplifiée :
6 CO₂ + 6 H₂O + lumière → C₆H₁₂O₆ + 6 O₂

Lieu : chloroplastes (contiennent la chlorophylle)

Importance :
- Produit du glucose (nourriture pour la plante)
- Libère de l'oxygène dans l'atmosphère
- Base de presque toutes les chaînes alimentaires`,
      mastered: false,
      createdAt: now - 3000,
      updatedAt: now - 3000,
    },
    {
      subject: "histoire",
      title: "La civilisation islamique (VIII-XIII siècles)",
      content: `L'âge d'or de la civilisation islamique s'étend du VIIIe au XIIIe siècle.

Centres importants :
- Bagdad (Maison de la Sagesse)
- Cordoue (Al-Andalus)
- Le Caire
- Fès

Contributions majeures :
- Mathématiques : algèbre (Al-Khawarizmi), chiffres arabes
- Médecine : Ibn Sina (Avicenne), Ibn Rushd (Averroès)
- Astronomie, optique, géographie
- Philosophie et traduction des textes grecs

Transmission du savoir vers l'Europe via l'Espagne musulmane.`,
      mastered: false,
      createdAt: now - 4000,
      updatedAt: now - 4000,
    },
    {
      subject: "francais",
      title: "Les figures de style",
      content: `Figures de style les plus courantes :

1. Comparaison : rapprochement avec "comme", "tel", "semblable à"
   Ex: Il est fort comme un lion.

2. Métaphore : comparaison sans outil de comparaison
   Ex: Cet homme est un lion.

3. Personnification : attributs humains à un objet/animal
   Ex: Le vent murmure.

4. Hyperbole : exagération
   Ex: Je meurs de faim.

5. Antithèse : opposition de deux idées
   Ex: Être ou ne pas être.

6. Anaphore : répétition en début de phrase

Utilité : enrichir le style, créer des images, émouvoir.`,
      mastered: false,
      createdAt: now - 5000,
      updatedAt: now - 5000,
    },
  ];

  await db.lessons.bulkAdd(lessons);

  // Quelques flashcards d'exemple
  const cards = [
    {
      subject: "maths",
      front: "Formule de Pythagore",
      back: "a² + b² = c² (c = hypothénuse)",
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
      createdAt: now,
    },
    {
      subject: "maths",
      front: "Résoudre 2x + 4 = 10",
      back: "2x = 6 → x = 3",
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
      createdAt: now,
    },
    {
      subject: "physique",
      front: "Unité de la force",
      back: "Newton (N)",
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
      createdAt: now,
    },
    {
      subject: "svt",
      front: "Où se déroule la photosynthèse ?",
      back: "Dans les chloroplastes (chlorophylle)",
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
      createdAt: now,
    },
    {
      subject: "francais",
      front: "Différence métaphore / comparaison",
      back: "La métaphore n'utilise pas d'outil de comparaison (comme, tel...)",
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
      createdAt: now,
    },
  ];

  await db.flashcards.bulkAdd(cards);

  return { seeded: true, message: "6 leçons + 5 flashcards ajoutées" };
}
