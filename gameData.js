window.gameData = [
  {
    name: "Triángulo",
    shape: "triangle",
    pool: [
      { q: "¿Cuántos lados tiene un triángulo?", a: ["2", "3", "4", "5"], c: 1, topic: "lados" },
      { q: "¿Cuántos vértices tiene un triángulo?", a: ["2", "3", "4", "5"], c: 1, topic: "vertices" },
      { q: "¿Cuántos ángulos tiene un triángulo?", a: ["2", "3", "4", "5"], c: 1, topic: "angulos" },
      { q: "¿Cuánto suman los ángulos internos de un triángulo?", a: ["90°", "180°", "360°", "120°"], c: 1, topic: "angulos" },
      { q: "¿Cuántas diagonales tiene un triángulo?", a: ["0", "1", "2", "3"], c: 0, topic: "diagonales" },
      { q: "¿Cuántos lados paralelos tiene un triángulo?", a: ["0", "1", "2", "3"], c: 0, topic: "lados" }
    ]
  },
  {
    name: "Cuadrado",
    shape: "square",
    pool: [
      { q: "¿Cuántos lados iguales tiene un cuadrado?", a: ["2", "3", "4", "Ninguno"], c: 2, topic: "lados" },
      { q: "¿Los lados de un cuadrado son...", a: ["Todos iguales", "Perpendiculares", "Curvos", "Diferentes"], c: 0, topic: "lados" },
      { q: "¿Cuánto mide cada ángulo interno de un cuadrado?", a: ["60°", "90°", "120°", "45°"], c: 1, topic: "angulos" },
      { q: "¿Cuántas diagonales tiene un cuadrado?", a: ["1", "2", "3", "4"], c: 1, topic: "diagonales" },
      { q: "¿Cuántos pares de lados paralelos tiene un cuadrado?", a: ["1", "2", "3", "4"], c: 1, topic: "lados" }
    ]
  },
  {
    name: "Rectángulo",
    shape: "rectangle",
    pool: [
      { q: "¿Cuántos lados tiene un rectángulo?", a: ["2", "3", "4", "5"], c: 2, topic: "lados" },
      { q: "¿Cuántos vértices tiene un rectángulo?", a: ["2", "3", "4", "5"], c: 2, topic: "vertices" },
      { q: "¿Cuántos pares de lados iguales tiene un rectángulo?", a: ["1", "2", "3", "4"], c: 1, topic: "lados" },
      { q: "¿Cuánto mide cada ángulo interno de un rectángulo?", a: ["60°", "90°", "120°", "45°"], c: 1, topic: "angulos" },
      { q: "¿Cuántas diagonales tiene un rectángulo?", a: ["1", "2", "3", "4"], c: 1, topic: "diagonales" },
      { q: "¿Los lados opuestos de un rectángulo son...?", a: ["Diferentes", "Curvos", "Iguales y paralelos", "Perpendiculares"], c: 2, topic: "lados" }
    ]
  },
  {
    name: "Rombo",
    shape: "rhombus",
    pool: [
      { q: "¿Cuántos lados iguales tiene un rombo?", a: ["2", "3", "4", "5"], c: 2, topic: "lados" },
      { q: "¿Cuántos vértices tiene un rombo?", a: ["3", "4", "5", "6"], c: 1, topic: "vertices" },
      { q: "¿Cuántos pares de lados iguales tiene un rombo?", a: ["1", "2", "3", "4"], c: 1, topic: "lados" },
      { q: "¿Cuántos ángulos obtusos tiene un rombo?", a: ["0", "1", "2", "4"], c: 2, topic: "angulos" },
      { q: "¿Cuántas diagonales tiene un rombo?", a: ["1", "2", "3", "4"], c: 1, topic: "diagonales" },
      { q: "¿Cuántos ángulos agudos tiene un rombo?", a: ["1", "2", "3", "4"], c: 1, topic: "angulos" }
    ]
  },
  {
    name: "Romboide",
    shape: "parallelogram",
    pool: [
      { q: "¿Cuántos pares de lados paralelos tiene un romboide?", a: ["0", "1", "2", "3"], c: 2, topic: "lados" },
      { q: "¿Cuántos vértices tiene un romboide?", a: ["3", "4", "5", "6"], c: 1, topic: "vertices" },
      { q: "¿Los lados opuestos de un romboide son...", a: ["Paralelos e iguales", "Perpendiculares", "Curvos", "Diferentes"], c: 0, topic: "lados" },
      { q: "¿Cuántos ángulos obtusos tiene un romboide?", a: ["0", "1", "2", "4"], c: 2, topic: "angulos" }
    ]
  },
  {
    name: "Trapecio",
    shape: "trapezoid",
    pool: [
      { q: "¿Cuántos lados paralelos tiene un trapecio?", a: ["0", "1", "2", "3"], c: 1, topic: "lados" },
      { q: "¿Cuántos vértices tiene un trapecio?", a: ["3", "4", "5", "6"], c: 1, topic: "vertices" },
      { q: "¿Cuántos ángulos tiene un trapecio?", a: ["3", "4", "5", "6"], c: 1, topic: "angulos" },
      { q: "¿Cuántos pares de lados paralelos tiene un trapecio?", a: ["0", "1", "2", "3"], c: 1, topic: "lados" },
      { q: "¿Cuántos lados tiene un trapecio?", a: ["3", "4", "5", "6"], c: 1, topic: "lados" }
    ]
  },
  {
    name: "Trapecio Rectángulo",
    shape: "rightTrapezoid",
    pool: [
      { q: "¿Cuántos lados paralelos tiene un trapecio rectángulo?", a: ["0", "1", "2", "3"], c: 1, topic: "lados" },
      { q: "¿Cuántos vértices tiene un trapecio rectángulo?", a: ["3", "4", "5", "6"], c: 1, topic: "vertices" },
      { q: "¿Cuántos ángulos rectos tiene un trapecio rectángulo?", a: ["0", "1", "2", "3"], c: 2, topic: "angulos" }
    ]
  },
  {
    name: "Trapecio Escaleno",
    shape: "scaleneTrapezoid",
    pool: [
      { q: "¿Cuántos lados paralelos tiene un trapecio escaleno?", a: ["0", "1", "2", "3"], c: 1, topic: "lados" },
      { q: "¿Cuántos vértices tiene un trapecio escaleno?", a: ["3", "4", "5", "6"], c: 1, topic: "vertices" },
      { q: "¿Cuántos ángulos internos iguales tiene un trapecio escaleno?", a: ["0", "1", "2", "3"], c: 0, topic: "angulos" }
    ]
  },
  {
    name: "Trapezoide",
    shape: "trapezoide",
    pool: [
      { q: "¿Cuántos lados paralelos tiene un trapezoide?", a: ["0", "1", "2", "3"], c: 0, topic: "lados" },
      { q: "¿Cuántos vértices tiene un trapezoide?", a: ["3", "4", "5", "6"], c: 1, topic: "vertices" },
      { q: "¿Cuántos ángulos tiene un trapezoide?", a: ["3", "4", "5", "6"], c: 1, topic: "angulos" }
    ]
  },
  {
    name: "Pentágono",
    shape: "pentagon",
    pool: [
      { q: "¿Cuántos lados tiene un pentágono?", a: ["4", "5", "6", "7"], c: 1, topic: "lados" },
      { q: "¿Cuántos vértices tiene un pentágono?", a: ["4", "5", "6", "7"], c: 1, topic: "vertices" },
      { q: "¿Cuánto mide cada ángulo interno de un pentágono regular?", a: ["90°", "108°", "120°", "135°"], c: 1, topic: "angulos" },
      { q: "¿Cuántas diagonales tiene un pentágono?", a: ["3", "4", "5", "6"], c: 2, topic: "diagonales" },
      { q: "¿Cuánto suman los ángulos internos de un pentágono?", a: ["360°", "540°", "720°", "900°"], c: 1, topic: "angulos" }
    ]
  },
  {
    name: "Hexágono",
    shape: "hexagon",
    pool: [
      { q: "¿Cuántos lados tiene un hexágono?", a: ["5", "6", "7", "8"], c: 1, topic: "lados" },
      { q: "¿Cuántos vértices tiene un hexágono?", a: ["5", "6", "7", "8"], c: 1, topic: "vertices" },
      { q: "¿Cuánto mide cada ángulo interno de un hexágono regular?", a: ["108°", "120°", "135°", "140°"], c: 1, topic: "angulos" },
      { q: "¿Cuántas diagonales tiene un hexágono?", a: ["6", "8", "9", "12"], c: 2, topic: "diagonales" },
      { q: "¿Cuánto suman los ángulos internos de un hexágono?", a: ["540°", "720°", "900°", "1080°"], c: 1, topic: "angulos" }
    ]
  },
  {
    name: "Heptágono",
    shape: "heptagon",
    pool: [
      { q: "¿Cuántos lados tiene un heptágono?", a: ["6", "7", "8", "9"], c: 1, topic: "lados" },
      { q: "¿Cuántos vértices tiene un heptágono?", a: ["6", "7", "8", "9"], c: 1, topic: "vertices" },
      { q: "¿Cuánto mide cada ángulo interno de un heptágono regular?", a: ["120°", "128.57°", "135°", "140°"], c: 1, topic: "angulos" }
    ]
  },
  {
    name: "Octágono",
    shape: "octagon",
    pool: [
      { q: "¿Cuántos lados tiene un octágono?", a: ["6", "7", "8", "9"], c: 2, topic: "lados" },
      { q: "¿Cuántos vértices tiene un octágono?", a: ["6", "7", "8", "9"], c: 2, topic: "vertices" },
      { q: "¿Cuánto mide cada ángulo interno de un octágono regular?", a: ["135°", "140°", "145°", "150°"], c: 0, topic: "angulos" }
    ]
  },
  {
    name: "Nonágono",
    shape: "nonagon",
    pool: [
      { q: "¿Cuántos lados tiene un nonágono?", a: ["7", "8", "9", "10"], c: 2, topic: "lados" },
      { q: "¿Cuántos vértices tiene un nonágono?", a: ["7", "8", "9", "10"], c: 2, topic: "vertices" },
      { q: "¿Cuánto mide cada ángulo interno de un nonágono regular?", a: ["135°", "140°", "145°", "150°"], c: 1, topic: "angulos" }
    ]
  },
  {
    name: "Decágono",
    shape: "decagon",
    pool: [
      { q: "¿Cuántos lados tiene un decágono?", a: ["8", "9", "10", "11"], c: 2, topic: "lados" },
      { q: "¿Cuántos vértices tiene un decágono?", a: ["8", "9", "10", "11"], c: 2, topic: "vertices" },
      { q: "¿Cuánto mide cada ángulo interno de un decágono regular?", a: ["140°", "144°", "150°", "156°"], c: 1, topic: "angulos" }
    ]
  },
  {
    name: "Endecágono",
    shape: "hendecagon",
    pool: [
      { q: "¿Cuántos lados tiene un endecágono?", a: ["9", "10", "11", "12"], c: 2, topic: "lados" },
      { q: "¿Cuántos vértices tiene un endecágono?", a: ["9", "10", "11", "12"], c: 2, topic: "vertices" },
      { q: "¿Cuánto mide cada ángulo interno de un endecágono regular?", a: ["144°", "147.27°", "150°", "153°"], c: 1, topic: "angulos" }
    ]
  },
  {
    name: "Dodecágono",
    shape: "dodecagon",
    pool: [
      { q: "¿Cuántos lados tiene un dodecágono?", a: ["10", "11", "12", "13"], c: 2, topic: "lados" },
      { q: "¿Cuántos vértices tiene un dodecágono?", a: ["10", "11", "12", "13"], c: 2, topic: "vertices" },
      { q: "¿Cuánto mide cada ángulo interno de un dodecágono regular?", a: ["140°", "145°", "150°", "155°"], c: 2, topic: "angulos" }
    ]
  },
  {
    name: "Círculo",
    shape: "circle",
    pool: [
      { q: "¿Cuántos vértices tiene un círculo?", a: ["0", "1", "2", "Infinitos"], c: 0, topic: "vertices" },
      { q: "¿Cuántos ángulos interiores tiene un círculo?", a: ["0", "1", "2", "Infinitos"], c: 0, topic: "angulos" }
    ]
  },
  {
    name: "Óvalo",
    shape: "oval",
    pool: [
      { q: "¿Cuántos vértices tiene un óvalo?", a: ["0", "1", "2", "4"], c: 0, topic: "vertices" },
      { q: "¿Cuántos ángulos interiores tiene un óvalo?", a: ["0", "1", "2", "Infinitos"], c: 0, topic: "angulos" }
    ]
  },
  {
    name: "Media Luna",
    shape: "crescent",
    pool: [
      { q: "¿Cuántos vértices tiene una media luna?", a: ["0", "1", "2", "3"], c: 0, topic: "vertices" },
      { q: "¿Cuántos ángulos interiores tiene una media luna?", a: ["0", "1", "2", "3"], c: 0, topic: "angulos" }
    ]
  },
  {
    name: "Estrella (5 puntas)",
    shape: "star",
    pool: [
      { q: "¿Cuántos vértices tiene una estrella de 5 puntas?", a: ["5", "8", "10", "12"], c: 2, topic: "vertices" },
      { q: "¿Cuántos lados tiene una estrella de 5 puntas?", a: ["5", "8", "10", "12"], c: 2, topic: "lados" },
      { q: "¿Cuántos ángulos tiene una estrella de 5 puntas?", a: ["5", "8", "10", "12"], c: 2, topic: "angulos" }
    ]
  },
  {
    name: "Corazón",
    shape: "heart",
    pool: [
      { q: "¿Cuántos vértices tiene un corazón estilizado?", a: ["0", "1", "2", "3"], c: 1, topic: "vertices" }
    ]
  },
  {
    name: "Semicírculo",
    shape: "semicircle",
    pool: [
      { q: "¿Cuántos vértices tiene un semicírculo?", a: ["0", "1", "2", "3"], c: 2, topic: "vertices" },
      { q: "¿Cuántos ángulos interiores tiene un semicírculo?", a: ["0", "1", "2", "3"], c: 0, topic: "angulos" }
    ]
  },
  {
    name: "Triángulo rectángulo",
    shape: "rightTriangle",
    pool: [
      { q: "¿Cuántos lados tiene un triángulo rectángulo?", a: ["2", "3", "4", "5"], c: 1, topic: "lados" },
      { q: "¿Cuántos vértices tiene un triángulo rectángulo?", a: ["2", "3", "4", "5"], c: 1, topic: "vertices" },
      { q: "¿Cuánto mide el ángulo recto de un triángulo rectángulo?", a: ["60°", "90°", "120°", "45°"], c: 1, topic: "angulos" },
      { q: "¿Cuánto mide el ángulo recto?", a: ["45°", "60°", "90°", "180°"], c: 2, topic: "angulos" }
    ]
  },
  {
    name: "Triángulo isósceles",
    shape: "isoscelesTriangle",
    pool: [
      { q: "¿Cuántos lados iguales tiene un triángulo isósceles?", a: ["0", "1", "2", "3"], c: 2, topic: "lados" },
      { q: "¿Cuántos vértices tiene un triángulo isósceles?", a: ["2", "3", "4", "5"], c: 1, topic: "vertices" },
      { q: "En un triángulo isósceles, ¿cuántos ángulos son iguales?", a: ["0", "1", "2", "3"], c: 2, topic: "angulos" }
    ]
  },
  {
    name: "Trapecio isósceles",
    shape: "isoscelesTrapezoid",
    pool: [
      { q: "¿Cuántos lados paralelos tiene un trapecio isósceles?", a: ["0", "1", "2", "3"], c: 1, topic: "lados" },
      { q: "¿Cuántos pares de ángulos iguales tiene un trapecio isósceles?", a: ["1", "2", "3", "0"], c: 1, topic: "angulos" }
    ]
  }
];

window.shopData = {
  weapons: [
    { id: "arma-1", type: "arma", name: "Blaster de Plasma", description: "Dispara ráfagas de energía azulada.", price: 100 },
    { id: "arma-2", type: "arma", name: "Cañón de Cometa", description: "Fuego continuo con velocidad de meteorito.", price: 120 },
    { id: "arma-3", type: "arma", name: "Rifle de Neón", description: "Precisión letal en cortas distancias.", price: 130 },
    { id: "arma-4", type: "arma", name: "Lanza de Asteroides", description: "Proyectiles pesados capaces de penetrar escudos.", price: 140 },
    { id: "arma-5", type: "arma", name: "Pistola Solar", description: "Descarga ardiente basada en energía solar.", price: 150 },
    { id: "arma-6", type: "arma", name: "Disruptor Cuántico", description: "Rompe la defensa enemiga con pulsos cuánticos.", price: 170 },
    { id: "arma-7", type: "arma", name: "Rayo Arcano", description: "Un haz místico de pura fuerza galáctica.", price: 180 },
    { id: "arma-8", type: "arma", name: "Fusil Galáctico", description: "Máxima potencia a larga distancia.", price: 200 },
    { id: "arma-9", type: "arma", name: "Cañón de Gravedad", description: "Arrastra y aplasta con explosiones gravitacionales.", price: 220 },
    { id: "arma-10", type: "arma", name: "Lanza Estelar", description: "Arma legendaria con alcance estelar.", price: 250 }
  ],
  suits: [
    { id: "traje-1", type: "traje", name: "Traje Lunar", description: "Protección ligera para misiones en la luna.", price: 110 },
    { id: "traje-2", type: "traje", name: "Armadura Solar", description: "Absorbe energía del sol para regenerarse.", price: 125 },
    { id: "traje-3", type: "traje", name: "Nexo Cósmico", description: "Traje con barrera de campo inmersiva.", price: 135 },
    { id: "traje-4", type: "traje", name: "Exo-escudo", description: "Mayores defensas contra impactos fuertes.", price: 145 },
    { id: "traje-5", type: "traje", name: "Traje Vortex", description: "Movilidad mejorada con impulso de vórtice.", price: 155 },
    { id: "traje-6", type: "traje", name: "Armadura Nebular", description: "Oculta al portador entre nubes espaciales.", price: 165 },
    { id: "traje-7", type: "traje", name: "Traje de Fase", description: "Permite esquivar ataques con breves fases.", price: 175 },
    { id: "traje-8", type: "traje", name: "Armadura Nova", description: "Resiste explosiones con protección de nova.", price: 190 },
    { id: "traje-9", type: "traje", name: "Traje de Orión", description: "Construcción robusta y estilo táctic.", price: 210 },
    { id: "traje-10", type: "traje", name: "Traje de Comando", description: "Diseñado para líderes en batallas espaciales.", price: 230 }
  ]
};
