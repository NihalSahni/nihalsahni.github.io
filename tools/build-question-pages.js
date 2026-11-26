// Builds /questions/<level>-<subject>/ : 15 real NSB questions per page, each
// with its answer and a short explanation, readable without JavaScript so
// search engines can index them.
//
// Questions are picked by their position in question.js (Object.keys order).
// The script checks each one still exists and stops if anything is off, so
// re-run it after editing question.js:   node tools/build-question-pages.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const bank = {};
vm.createContext(bank);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'question.js'), 'utf8'), bank);

const SUBJECTS = [
  { slug: 'biology', key: 'Biology', name: 'Biology' },
  { slug: 'chemistry', key: 'Chemistry', name: 'Chemistry' },
  { slug: 'physics', key: 'Physics', name: 'Physics' },
  { slug: 'earth-science', key: 'EarthSpace', name: 'Earth Science' },
  { slug: 'energy', key: 'Energy', name: 'Energy' },
  { slug: 'math', key: 'Math', name: 'Math' },
];
const LEVELS = {
  HS: { word: 'high', label: 'High School', grades: '9-12', accent: 'var(--magenta)' },
  MS: { word: 'middle', label: 'Middle School', grades: '6-8', accent: 'var(--cyan)' },
};

// ── Page content ────────────────────────────────────────────────────────────
const PAGES = {
  HS: {
    biology: {
      covers: 'cell biology, genetics, human physiology, ecology, evolution and classification',
      tips: [
        'Know the human body well. Organs, hormones and exactly where things happen (like the SA node in the right atrium) come up again and again.',
        'For genetics problems, write out the cross. Most probability questions come down to multiplying simple fractions like 1/2 and 1/4.',
        'Learn word roots. A word like "capnophile" makes sense once you know capno- means smoke and -phile means loving.',
      ],
      q: [
        [0, 'LDL and HDL are lipoproteins that carry cholesterol through the blood. When too much LDL cholesterol builds up in artery walls, it forms the plaques of atherosclerosis.'],
        [13, 'A Barr body is an inactivated, tightly coiled X chromosome. Female mammals have two X chromosomes, and one is switched off in each cell so both sexes get the same dose of X-linked genes.'],
        [54, 'For each trait, Aa × Aa gives Aa half the time. Because the three traits assort independently, multiply: 1/2 × 1/2 × 1/2 = 1/8.'],
        [74, 'Producers sit at the base of the pyramid. Only about 10% of the energy at each level passes up to the next, so producers always hold the most biomass productivity.'],
        [85, 'Aquaporins are channel proteins that let water move through the membrane far faster than it could cross the lipid bilayer alone. They are especially important in kidney cells.'],
        [96, 'The nucleolus makes ribosomal RNA (rRNA) and assembles it with proteins into ribosome subunits, which then leave the nucleus to make proteins in the cytoplasm.'],
        [121, 'Intercalated disks connect cardiac muscle cells. They contain gap junctions that let electrical signals pass quickly from cell to cell so the heart contracts as one unit.'],
        [134, 'Widening the arterioles (vasodilation) lowers resistance to blood flow, which lowers blood pressure. Pumping more blood, faster or with bigger strokes, raises it.'],
        [139, 'Their daughter doesn\'t have webbed digits, so she got a recessive allele from her father. That makes him heterozygous (Ww). Ww × ww gives Ww half the time, so 1/2 of their children are expected to have webbed digits.'],
        [164, 'The sinoatrial (SA) node, the heart\'s natural pacemaker, sits in the wall of the right atrium. It starts each heartbeat.'],
        [176, 'In the light reactions, water is split to replace electrons lost by chlorophyll, and that releases O₂. Experiments with oxygen-18 showed the oxygen comes from water, not CO₂.'],
        [177, 'From broadest to narrowest, taxonomy goes domain, kingdom, phylum, class, order, family, genus, species. Reversed and narrowed to these four: genus, class, phylum, domain.'],
        [181, 'This is a trophic cascade. Sea otters eat sea urchins, and urchins eat kelp. Fewer otters means more urchins, and more urchins means less kelp.'],
        [212, 'The joint at the base of the thumb (the carpometacarpal joint) is a saddle joint. Its two saddle-shaped surfaces let the thumb move in two directions and swing across the palm.'],
        [239, 'Homologous structures share the same bone layout because they come from a common ancestor. A bat wing and a porpoise flipper are front limbs built on the same plan as the human arm. A cat\'s hind leg matches the human leg instead.'],
      ],
    },
    chemistry: {
      covers: 'atomic structure, bonding, periodic trends, stoichiometry, acids and bases, thermodynamics and organic chemistry',
      tips: [
        'Memorize the periodic trends (electronegativity, ionization energy, atomic radius) and their exceptions, like oxygen\'s lower ionization energy compared with nitrogen\'s.',
        'Practice pH and dilution math without a calculator. Most questions use powers of 10 so the logs come out to whole numbers.',
        'Know the activity series and solubility rules. They answer a lot of "which one reacts" and "which one dissolves" questions quickly.',
      ],
      q: [
        [12, 'Avogadro\'s principle (or law) says that at the same temperature and pressure, equal volumes of any gas contain the same number of particles. At STP, one mole of an ideal gas takes up about 22.4 liters.'],
        [33, 'Electronegativity increases from left to right across a period. Of these period-2 elements, beryllium is the furthest left, so it is the least electronegative.'],
        [43, 'Magnesium carbonate barely dissolves in water, but carbonates react with acid: MgCO₃ + 2HCl → MgCl₂ + H₂O + CO₂. The other three are soluble nitrate, sulfate and perchlorate salts.'],
        [64, 'Octadecanoic acid (stearic acid) has 18 carbons in total. One carbon is in the COOH group, so the rest of the chain is C₁₇H₃₅, giving C₁₇H₃₅COOH.'],
        [72, 'Ionization energy usually rises across a period, but oxygen breaks the trend. Its fourth 2p electron is paired with another in the same orbital, and the repulsion between them makes it easier to remove than nitrogen\'s electrons.'],
        [81, 'CCl₄ has four polar C–Cl bonds, but its tetrahedral shape makes them cancel out, so the molecule has no overall dipole. SO₂ is bent, and acetone and ICl are lopsided, so all three are polar.'],
        [89, '0.1 M HCl has [H⁺] = 10⁻¹, so its pH is 1. Diluting 100-fold makes [H⁺] = 10⁻³, so the pH becomes 3. Each 10-fold dilution of a strong acid raises the pH by 1.'],
        [92, 'A p-type semiconductor needs a dopant with fewer valence electrons than silicon\'s four. Aluminum has three, which leaves positive "holes" that carry current. Phosphorus, with five, would make an n-type semiconductor.'],
        [94, 'Rhombic (orthorhombic) sulfur, made of crown-shaped S₈ rings, is the stable form at room temperature. Above about 96 °C it changes to monoclinic sulfur.'],
        [123, 'A stronger reducing agent gives up electrons more easily. On the activity series zinc is the most active, then lead, then copper. So in increasing order: copper, lead, zinc.'],
        [124, 'Smoke is solid particles spread through air, an unevenly mixed colloid, so it is heterogeneous. Gasoline, air and vinegar are all evenly mixed solutions.'],
        [159, 'CaCl₂ splits into one Ca²⁺ ion and two Cl⁻ ions, which makes 3 particles per formula unit. So its ideal van\'t Hoff factor is 3.'],
        [192, 'Radioactive decay is first order: the rate depends only on how much of the isotope is present. That\'s why its half-life stays constant no matter how much sample you start with.'],
        [199, 'ΔT = i·Kb·m, so 0.5 = 2 × 0.5 × m and m = 0.5 mol/kg. 100 mL of water is 0.1 kg, so you need 0.05 mol of NaCl. At 58.4 g/mol, that\'s about 2.9 grams.'],
        [202, 'Ammonium sulfate, (NH₄)₂SO₄, has covalent bonds inside the NH₄⁺ and SO₄²⁻ ions and ionic bonds between them. POCl₃ is only covalent, and KCl is only ionic.'],
      ],
    },
    physics: {
      covers: 'mechanics, waves, electricity and magnetism, thermodynamics and modern physics, with many quick calculations',
      tips: [
        'Learn the core formulas until they\'re automatic: v = fλ, P = IV = I²R, W = Fd cos θ, P = Fv, and V = W/q.',
        'Questions are built so the numbers come out cleanly. If your answer is messy, check your units and look for a simpler setup.',
        'Watch for distractors. Information like how long something took is sometimes included even when it doesn\'t affect the answer.',
      ],
      q: [
        [23, 'Wave speed = frequency × wavelength, so wavelength = v / f = 360 / 600 = 0.6 meters.'],
        [52, 'Absolute pressure is atmospheric pressure plus water pressure, so the water must add 9.8 atm, about 9.9 × 10⁵ Pa. Using P = ρgh, h = 9.9 × 10⁵ / (1000 × 9.8) ≈ 101 meters.'],
        [56, 'Potential difference is work per unit charge: V = W / q = 15 J / 3 C = 5 volts.'],
        [64, 'One photon has E = hc/λ = (6.63 × 10⁻³⁴)(3 × 10⁸) / 10⁻⁶ ≈ 2 × 10⁻¹⁹ J. Multiply by Avogadro\'s number (6.02 × 10²³) to get about 1.2 × 10⁵ J, or 120,000 joules.'],
        [73, 'P = I²R = (0.020 A)² × 50,000 Ω = 0.0004 × 50,000 = 20 watts.'],
        [74, 'Pascal\'s principle says the pressure is the same under both pistons, so weight divided by area must match: 50 / 30 = m / 75. That gives m = 125 kilograms.'],
        [87, 'Torques balance when 8 × d = 20 × (7 − d). That gives 28d = 140, so d = 5 meters. The fulcrum sits closer to the heavier mass.'],
        [110, 'Static friction has to hold up the book\'s weight: μN = mg. The normal force is your 50 N push, so μ = (2 × 9.8) / 50 = 0.392.'],
        [112, '300 days is 5 half-lives. 1000 g × (1/2)⁵ = 1000 / 32 = 31.25, so about 31 grams remain.'],
        [115, 'Only the part of the force along the motion does work: W = F·d·cos θ = 10 × 3 × cos 60° = 15 joules. The 4 seconds doesn\'t matter, since time affects power, not work.'],
        [153, 'Yanking upward accelerates the yo-yo up, so the string has to pull with more than its weight: T = m(g + a). The tension increases.'],
        [172, 'C = ε₀A / d = (8.85 × 10⁻¹² × 1) / (1 × 10⁻⁶) = 8.85 × 10⁻⁶ F, which rounds to 9 microfarads.'],
        [177, 'Parallel resistors combine as 1/R = 1/5 + 1/8 + 1/20 = 0.375, so R ≈ 2.67 Ω. Then P = I²R = 10² × 2.67 ≈ 267 watts.'],
        [186, 'On a string fixed at both ends, nodes and antinodes alternate and both ends are nodes, so there is always one more node than antinode. Antinodes minus nodes is −1.'],
        [203, 'At constant speed, power = force × velocity = 4000 N × 30 m/s = 120,000 watts (120 kW).'],
      ],
    },
    'earth-science': {
      covers: 'geology, plate tectonics, minerals and rocks, meteorology, oceanography and astronomy',
      tips: [
        'Learn Bowen\'s reaction series and the rock cycle. They explain which minerals form first and how rocks change.',
        'Know the classic examples: Vesuvius for composite volcanoes, the Perseids for meteor showers, karst for caves and sinkholes.',
        'Astronomy is a big part of this subject. Review stellar evolution, the planets, and how the sky moves (precession, equinoxes, coordinates).',
      ],
      q: [
        [0, 'Horsts (raised blocks) and grabens (dropped blocks) form where the crust is pulled apart. Tension creates normal faults, where the hanging wall slides down.'],
        [22, 'Wind blowing across the sea surface transfers energy to the water, building waves and driving surf currents near shore.'],
        [40, 'Dendrochronology dates trees by counting and matching their yearly growth rings. Sclerochronology does the same with shells and corals.'],
        [46, 'Magma crystallizes when it gets below its melting point. Cooling, adding pressure, or raising the melting point all help. Raising the temperature does the opposite and keeps it liquid.'],
        [55, 'S-waves can\'t travel through liquids. The outer core is liquid iron and nickel, which creates the S-wave shadow zone seismologists use as proof that it\'s liquid.'],
        [63, 'White dwarfs don\'t shrink as they cool. Electron degeneracy pressure, not heat, holds them up, so their radius stays about the same as they fade.'],
        [90, 'Albedo is the share of sunlight a surface reflects. Open ocean is dark and absorbs most sunlight (albedo around 0.06), while fresh ice reflects most of it.'],
        [99, 'Bowen\'s reaction series says olivine crystallizes first, at the highest temperature, from mafic and ultramafic magma. Quartz comes last.'],
        [103, 'NASA\'s Opportunity rover found small hematite spheres, nicknamed "blueberries", at Meridiani Planum. Hematite usually forms in water, so they suggest Mars was once wet.'],
        [124, 'Homo sapiens appeared about 300,000 years ago, in the Quaternary period of the Cenozoic Era, the current era, which began 66 million years ago.'],
        [131, 'Vesuvius is a composite volcano (stratovolcano), built from layers of lava and ash. Thick, gassy magma makes these volcanoes erupt explosively, like the eruption that buried Pompeii in 79 AD.'],
        [132, 'Karst landscapes form where groundwater slowly dissolves soluble rock like limestone, leaving caves, sinkholes and streams that disappear underground.'],
        [145, 'Foliated rocks have minerals lined up in layers from directed pressure. Gneiss and phyllite are foliated. Marble and quartzite are non-foliated, because they\'re mostly a single mineral.'],
        [158, 'The Perseids peak around August 12 each year, when Earth passes through debris left by Comet Swift-Tuttle.'],
        [176, 'Wind pushes the surface water, and the Coriolis effect turns each deeper layer a bit more, making a spiral. Overall, the water moves about 90° from the wind direction.'],
      ],
    },
    energy: {
      covers: 'how energy is produced and stored, nuclear and renewable power, thermodynamics, and research at DOE national laboratories',
      tips: [
        'Know how a nuclear reactor works: fuel, moderator, control rods, coolant, and common fission products like xenon.',
        'Learn the main storage technologies (pumped hydro, batteries, compressed air, flywheels) and what limits each one.',
        'Many questions mention research at DOE labs like Argonne, Oak Ridge or SLAC. Don\'t panic, because the question underneath is usually basic chemistry or physics.',
      ],
      q: [
        [21, 'Vulcanization heats rubber with sulfur. The sulfur forms cross-links between polymer chains, making the rubber stronger, more elastic and less sticky. Charles Goodyear developed it in 1839.'],
        [23, 'Ohm\'s law: V = IR = 6 A × 5 Ω = 30 volts.'],
        [40, 'A moderator slows fast neutrons so they\'re more likely to cause fission. Hydrogen nuclei are about the same mass as a neutron and scatter them strongly, so each collision takes away a lot of the neutron\'s energy.'],
        [43, 'Most commercial solar panels convert only about 15–23% of sunlight into electricity, so low efficiency is the main challenge.'],
        [45, 'Uranium is a mineral element formed in exploding stars long before Earth existed. Gasohol (with ethanol from crops), crude oil (from ancient marine life) and charcoal (from wood) all came from living things.'],
        [51, 'Pumped hydro needs hills and water, and compressed air needs underground caverns. Batteries can be installed almost anywhere.'],
        [55, 'Sulfur compounds help lubricate petroleum diesel, so ultra-low-sulfur diesel lubricates engines poorly. Biodiesel still lubricates well despite its low sulfur, and it is often blended in to restore lubricity.'],
        [60, 'The moderator, usually water or graphite, slows fast neutrons to thermal speeds, where U-235 is much more likely to fission.'],
        [63, 'Hydroelectric power produces more electricity worldwide than any other renewable source, although wind and solar are growing faster.'],
        [100, 'Xenon and krypton isotopes are common fission products. Xenon-135 matters a lot in reactor operation because it absorbs neutrons very strongly.'],
        [128, 'A flywheel stores energy as rotational kinetic energy (½Iω²) by spinning a heavy rotor very fast, then turns it back into electricity by slowing it down.'],
        [139, 'At constant temperature and pressure, the drop in Gibbs free energy is the most non-expansion work a system can do. Helmholtz energy plays that role at constant volume.'],
        [140, 'The first law of thermodynamics says ΔU = Q + W: the change in internal energy equals the heat added plus the work done on the system.'],
        [143, 'Each LED drops 3.1 V. Three LEDs use 9.3 V, which a 12 V source can supply. Four would need 12.4 V, which is too much. So the answer is 3.'],
        [145, 'Photon energy is E = hf, so higher frequency means more energy. Of these, X-rays have the highest frequency, then ultraviolet, infrared and microwaves.'],
      ],
    },
    math: {
      covers: 'algebra, geometry, trigonometry, precalculus, probability and calculus, all solved without a calculator',
      tips: [
        'Speed matters more than difficulty. Practice common moves until they\'re instant: vertex formula, combinations, derivatives of polynomials.',
        'Plugging in often beats solving. On multiple-choice questions, testing each option is usually the fastest route.',
        'Memorize key facts like cube and face diagonals, trig values at 30°, 45° and 60°, and the cone-to-cylinder volume ratio of 1 to 3.',
      ],
      q: [
        [17, 'The tangent slope is the derivative. F′(x) = −200 − 10x, so F′(4) = −200 − 40 = −240.'],
        [54, 'For x ≥ −1, setting −x² + x = 3x + 3 gives x² + 2x + 3 = 0, which has no real roots. For x < −1, it gives x² − 4x − 3 = 0, whose roots, 2 ± √7, aren\'t less than −1. So the graphs never meet.'],
        [66, 'The vertex is at x = −b/(2a) = 16 / (−8) = −2. Then y = −4(4) − 16(−2) − 9 = −16 + 32 − 9 = 7. So the vertex is (−2, 7).'],
        [77, 'A quadrilateral can be inscribed in a circle only if its opposite angles add up to 180°. Every rectangle\'s angles are 90°, so it always works. Parallelograms, rhombuses and kites only work in special cases.'],
        [81, 'Simplify inside the brackets: x − 3x − 1 = −2x − 1. Then 2(−2x − 1) = −4x − 2. Setting −4x − 2 = 4 − 2x gives −2x = 6, so x = −3.'],
        [85, 'Cross-multiply: 13(x − y) = 9(x + y), so 13x − 13y = 9x + 9y. That gives 4x = 22y, so x/y = 22/4 = 11/2.'],
        [98, 'Plug each point into 2x − 3y. For (1, −14/3): 2 + 14 = 16, not −12, so the line misses it. The other three points all give −12.'],
        [118, 'Use cos 2x = 1 − 2sin²x: sin x + 1 − 2sin²x = 1, so sin x(1 − 2sin x) = 0. Then sin x = 0 or sin x = 1/2. The smallest positive angle is 30°.'],
        [121, 'An even function has f(−x) = f(x), so its graph is symmetric about the y-axis. cos(−x) = cos x, while sine, tangent and cotangent are odd.'],
        [124, 'Order doesn\'t matter, so use combinations: C(7, 2) = (7 × 6) / 2 = 21.'],
        [137, 'f′(x) < 0 means f is always decreasing, so its biggest value is at the left end of the domain. f(2) is the top of the range: 8.'],
        [144, 'The center is the midpoint of the diameter, so the other end = 2 × center − known end = (6 − 5, 8 + 6, −14 − 2) = (1, 14, −16).'],
        [150, 'Inverse proportion to y³ means x·y³ stays constant: 3 × 4³ = 192. So when y = 3, x = 192 / 27 = 64/9.'],
        [168, 'For a cube with side s, the space diagonal is s√3 and a face diagonal is s√2, so the ratio is √3 to √2.'],
        [194, 'A cone\'s volume is ⅓πr²h = ⅓πr²(5). The cylinder\'s is πr²(10), with the same radius. Dividing: 10 / (5/3) = 6 cups.'],
      ],
    },
  },
  MS: {
    biology: {
      covers: 'cells, the human body, plants, genetics, ecology and classification',
      tips: [
        'Know the parts of a cell and what each one does. Organelle questions show up in almost every round.',
        'Learn the main human body systems and their key organs, like the hypothalamus, the cochlea and the placenta.',
        'For ecology, practice naming relationships: mutualism, parasitism, commensalism, and predator and prey.',
      ],
      q: [
        [0, 'Chemotrophs get their energy from chemicals instead of sunlight. Bacteria at deep-sea vents and in sulfur caves use chemosynthesis, breaking down compounds like hydrogen sulfide to make food.'],
        [28, 'Bacteria swim by spinning long, whip-like flagella that work like tiny propellers.'],
        [47, 'Transpiration is water evaporating from leaves, mostly through open stomata. It pulls water up from the roots through the xylem.'],
        [65, 'Both species benefit: the birds get food, and the mammals get rid of ticks and other parasites. Oxpeckers on rhinos and zebras are a classic example.'],
        [73, 'Stomata let gases in and out of the leaf. Closing them traps the oxygen made by photosynthesis and the water vapor that would leave by transpiration. It also keeps carbon dioxide from getting in.'],
        [84, 'An insect\'s body has three parts: head, thorax and abdomen. The legs and wings attach to the thorax.'],
        [114, 'Scurvy comes from a lack of vitamin C (ascorbic acid), which the body needs to make collagen. Sailors used to prevent it by eating citrus fruit.'],
        [121, 'Aa × Aa gives AA, Aa, Aa, aa. AA and aa are homozygous: 2 out of 4, or 50%.'],
        [128, 'The organ of Corti sits in the cochlea of the inner ear. Its hair cells turn sound vibrations into nerve signals.'],
        [141, 'A peptide bond forms between the carboxyl group of one amino acid and the amino group of the next, releasing a water molecule.'],
        [152, 'Fish appeared first (over 500 million years ago), then insects, then reptiles. Mammals came last, about 200 million years ago.'],
        [157, 'Archaea are single-celled microbes known for living in extreme places like hot springs, salt lakes and deep-sea vents. Many extremophiles are archaea.'],
        [162, 'Phytoplankton are tiny floating algae and cyanobacteria. They photosynthesize, form the base of ocean food webs, and produce a large share of Earth\'s oxygen.'],
        [167, 'The hypothalamus links the nervous system to the endocrine system by controlling the pituitary gland. It regulates body temperature, hunger and thirst.'],
        [207, 'The endosperm is stored food, mostly starch, that feeds the young plant until it can photosynthesize. It\'s the main part of grains like wheat and corn.'],
      ],
    },
    chemistry: {
      covers: 'atoms, the periodic table, chemical and physical changes, acids and bases, and lab basics',
      tips: [
        'Learn the periodic table groups: alkali metals, halogens and noble gases, and why elements in the same group act alike.',
        'Practice telling physical changes from chemical changes, and physical properties from chemical properties. These questions are easy points.',
        'Know metric prefixes (kilo, centi, milli, micro) so unit conversions take seconds.',
      ],
      q: [
        [5, 'Dry ice is frozen carbon dioxide (CO₂). At normal pressure it sublimates, going straight from solid to gas at −78.5 °C.'],
        [13, 'A phase change, like ice melting, is a physical change: the molecules stay the same. Color changes, precipitates and gas bubbles can all signal a new substance.'],
        [14, 'A chemical property describes how a substance reacts to become something new. Sodium reacting with water to make hydrogen gas is one. Density, melting point and shininess are physical properties.'],
        [17, 'Phosphoric acid (H₃PO₄) only partly ionizes in water, so it\'s a weak acid. Hydrochloric, sulfuric and perchloric acids ionize completely.'],
        [24, 'A fuel cell is a voltaic cell that keeps running as long as fuel (like hydrogen) and oxygen are supplied, unlike a battery, which runs out.'],
        [25, 'A Lewis base donates an electron pair, and a Lewis acid accepts one. Ammonia (NH₃) is a classic Lewis base because of its lone pair.'],
        [27, 'Elements in period 3 and below, like chlorine, can hold more than 8 valence electrons, as in ClF₃. Period-2 elements like C, N, O and F can\'t.'],
        [33, 'Add the two atomic masses: 22.99 + 35.45 = 58.44 g/mol.'],
        [34, 'Nitrogen is more electronegative than hydrogen, so it\'s assigned −3, and each of the three hydrogens is +1. The total is −3 + 3(+1) = 0.'],
        [41, 'Titanium (Ti, atomic number 22) is named after the Titans of Greek mythology. It\'s strong, light and resists corrosion, which makes it useful in aircraft and medical implants.'],
        [46, 'Hydrogen makes up about 74% of the normal matter in the universe by mass, and most of the atoms.'],
        [54, 'Argon is a noble gas with a full outer shell, so it barely reacts. Chlorine, iodine and fluorine are all halogens, among the most reactive elements.'],
        [60, 'Paper is mostly cellulose, the plant fiber polymer made of linked glucose units, usually from wood pulp.'],
        [77, 'The Sun is about 73% hydrogen and about 25% helium by mass. Fusion in its core keeps turning hydrogen into helium.'],
        [78, '"Milli" means one thousandth and "micro" means one millionth, so 1 milligram = 1,000 micrograms.'],
      ],
    },
    physics: {
      covers: 'forces and motion, energy, simple machines, waves, electricity, and atoms',
      tips: [
        'Know the six simple machines and Newton\'s three laws. They show up in almost every middle school round.',
        'Practice quick formulas: distance = speed × time, work = force × distance, momentum = mass × velocity.',
        'Remember that inertia depends only on mass, and acceleration means any change in speed or direction.',
      ],
      q: [
        [12, 'Momentum = mass × velocity. That gives 1 × 10 = 10, 1.5 × 10 = 15, and 1 × 20 = 20 (in ton·m/s), so the order is 1, 2, 3.'],
        [19, 'Both floors are the same temperature, but concrete conducts heat away from your feet faster than wood does, so it feels colder.'],
        [25, 'A stretched rubber band stores elastic potential energy, which turns into kinetic energy when you let go.'],
        [38, 'Levers and ramps (inclined planes) are two of the six simple machines. A bicycle is a compound machine made of several simple machines, like wheels and axles and levers.'],
        [64, 'A proton is two up quarks (+⅔ each) and one down quark (−⅓), for a total charge of +1. A neutron is one up and two down quarks.'],
        [65, 'The metric (SI) base unit of mass is the kilogram, not the gram. Meters, seconds and amperes are all base units.'],
        [81, 'Fiber optic cables trap light inside a glass core by total internal reflection, so pulses of light can carry data long distances.'],
        [83, 'Fish change how much gas is in their swim bladder to adjust their buoyancy, so they can float at a depth without swimming.'],
        [94, 'Inertia depends only on mass. The 4 kg of iron has the most. 5 newtons of iron weighs only about 0.5 kg.'],
        [114, 'The six simple machines are the lever, wheel and axle, pulley, inclined plane, wedge and screw.'],
        [128, 'Pascal\'s principle says pressure applied to an enclosed fluid spreads equally everywhere in it. That\'s how hydraulic lifts and brakes work.'],
        [132, 'Distance = speed × time = 30 m/s × 20 s = 600 meters.'],
        [138, 'Acceleration is any change in speed or direction. The braking car slows down, and the Moon keeps changing direction as it orbits. The skater at constant velocity isn\'t accelerating.'],
        [141, 'Boron always has 5 protons. Boron-10 has 5 neutrons, and boron-11 has 6, so they differ by one neutron.'],
        [160, 'Work = force × distance = 80 N × 2 m = 160 joules.'],
      ],
    },
    'earth-science': {
      covers: 'rocks and minerals, Earth\'s layers, weather, oceans, the Moon, and the solar system',
      tips: [
        'Learn the planets\' key facts: order, size, density, and oddities like Venus\'s backward spin.',
        'Know the rock cycle and the three rock types, including which rocks turn into which (limestone into marble, shale into slate).',
        'Review Moon phases, eclipses and tides together. They all come from how the Sun, Earth and Moon line up.',
      ],
      q: [
        [14, 'At new and full moon, the Sun, Moon and Earth line up, and their pull combines to make spring tides, with the highest highs and lowest lows.'],
        [33, 'Venus spins backward compared with most planets (retrograde rotation), so the Sun rises in the west there. A single Venus day lasts longer than its year.'],
        [57, 'Permafrost is ground that stays at or below 0 °C for at least two years in a row. It covers large areas of the Arctic, and thawing permafrost releases greenhouse gases.'],
        [66, 'Earth\'s rotation makes moving air and water appear to curve. This Coriolis effect turns them right in the Northern Hemisphere and left in the Southern.'],
        [93, 'A lunar eclipse happens at full moon, when Earth is directly between the Sun and Moon and Earth\'s shadow falls on the Moon.'],
        [106, 'Refracting telescopes bend light with convex lenses. Reflecting telescopes use curved mirrors instead.'],
        [134, 'The Jovian (gas giant) planets are Jupiter, Saturn, Uranus and Neptune: large planets made mostly of gases and ices.'],
        [148, 'Saturn\'s average density is about 0.69 g/cm³, less than water\'s, so in theory it would float in a big enough bathtub.'],
        [153, 'Topographic maps use contour lines to show elevation and steepness, which is exactly what you need for hiking in mountains.'],
        [165, 'Lithification is how loose sediment turns into sedimentary rock: layers pile up, compact under pressure, and minerals cement the grains together.'],
        [184, 'The lithosphere is the crust plus the rigid top of the mantle. It\'s broken into the tectonic plates.'],
        [198, 'Heat and pressure recrystallize the calcite in limestone into marble, a non-foliated metamorphic rock.'],
        [207, 'Carbonates contain the CO₃ group. Dolomite, aragonite and malachite are carbonates. Labradorite is a feldspar, which is a silicate mineral.'],
        [213, 'Earth\'s magnetic field funnels charged particles from the solar wind toward the poles. When they hit the upper atmosphere, it glows. Without the field, there would be no auroras.'],
        [258, 'The ozone layer is in the stratosphere, about 15–35 km up. It absorbs most of the Sun\'s harmful ultraviolet radiation.'],
      ],
    },
    energy: {
      covers: 'energy sources, electricity, fossil fuels and renewables, and research at DOE national laboratories',
      tips: [
        'Know the difference between energy (joules, kilowatt-hours) and power (watts), and how to convert between them.',
        'Learn the main renewable and nonrenewable sources, plus one fact about each, like hydropower being the biggest renewable.',
        'Questions about DOE labs often hide a simple science question. Read to the end before you panic.',
      ],
      q: [
        [14, 'Uranium is a mineral element made in stars long before life existed. The other three come from living things: crops for gasohol, ancient sea life for crude oil, and wood for charcoal.'],
        [25, 'Peak oil is the point when world oil production hits its highest rate. After that, production falls because the reserves get harder to reach.'],
        [26, 'Activation energy is the "hill" reactants must climb before they can react. A higher hill means fewer collisions have enough energy, so the reaction slows down.'],
        [27, 'A pendulum\'s period is T = 2π√(L/g), so it depends only on string length and gravity. Changing the mass doesn\'t change the period.'],
        [34, '0 kelvin is −273.15 °C, and 50 millikelvins is only 0.05 K, so it\'s about −273.1 °C. To the nearest degree: −273 °C.'],
        [39, 'Almost all of Earth\'s energy comes from the Sun. It drives weather, wind and the water cycle, and plants capture it through photosynthesis. Even fossil fuels are stored ancient sunlight.'],
        [46, 'Joules and kilowatt-hours measure energy (1 kWh = 3.6 million J). A watt measures power, which is how fast energy is used: 1 watt = 1 joule per second.'],
        [47, 'Hydropower makes more of the world\'s renewable electricity than any other source, using flowing water to spin turbines.'],
        [48, 'A transformer\'s voltage ratio equals its turns ratio: 440 V / 110 V = 4. So the input coil has 4 turns for every 1 on the output coil, a step-down transformer.'],
        [60, 'Coal, oil and natural gas form from buried plant and animal remains in layers of sediment, so they\'re found in sedimentary rock.'],
        [66, 'Cars use lead-acid batteries because they\'re cheap and can deliver the burst of current needed to start the engine.'],
        [75, 'Concentrated solar power uses mirrors to focus sunlight and make heat, often stored in molten salt. That heat makes steam to run a turbine, even after sunset.'],
        [78, 'R-value measures how well insulation resists heat flow through a given area. The higher the R-value, the better it insulates.'],
        [81, 'Energy = power × time = 100 W × 1 h = 100 watt-hours = 0.1 kilowatt-hours.'],
        [82, 'Nuclear fission splits a heavy uranium nucleus into smaller ones and releases a lot of energy. Nuclear power plants run on fission.'],
      ],
    },
    math: {
      covers: 'arithmetic, fractions, algebra, geometry and basic probability, all solved without a calculator',
      tips: [
        'Practice mental math every day. There are no calculators, and many points come down to quick arithmetic.',
        'Memorize the common Pythagorean triples (3-4-5, 5-12-13, 8-15-17, 7-24-25, 9-40-41) and their multiples.',
        'For "how many must you take" questions, always picture the worst-case draw first.',
      ],
      q: [
        [26, 'Slope = (8 − (−2)) / (−8 − (−12)) = 10/4 = 5/2. Plug in (−8, 8): 8 = (5/2)(−8) + b = −20 + b, so b = 28.'],
        [50, 'Let x = 0.8333…. Then 100x − 10x = 83.33… − 8.33… = 75, so 90x = 75 and x = 75/90 = 5/6.'],
        [73, 'The triangle inequality says the third side must be between 12 − 3 = 9 and 12 + 3 = 15. Only 12 fits.'],
        [79, 'The first three negative even integers are −2, −4 and −6. (−2)(−4)(−6) = 8 × (−6) = −48.'],
        [105, 'Square the inside first: (2xy²)² = 4x²y⁴. Then multiply by x: 4x³y⁴.'],
        [124, 'The squirrel ends up 15 m north and 7 m west. Using the Pythagorean theorem, √(15² + 7²) = √274 ≈ 16.6, which rounds to 17 meters.'],
        [129, 'Each tank holds 540π / 3 = 180π. Since V = πr²h, 180π = πr²(5), so r² = 36 and r = 6.'],
        [144, 'f(−2) = (−8) − 3(4) − 7(−2) + 4 = −8 − 12 + 14 + 4 = −2.'],
        [183, 'A square\'s diagonal is side × √2, so side = 16 / √2 = 8√2 ≈ 11.3, which rounds to 11 cm.'],
        [199, 'C = (F − 32) × 5/9 = (50 − 32) × 5/9 = 18 × 5/9 = 10 °C.'],
        [222, 'A composite number has factors other than 1 and itself. 33 = 3 × 11 and 63 = 7 × 9. The numbers 3, 11 and 53 are prime.'],
        [255, 'Check a² + b² = c². For 5-12-13: 25 + 144 = 169 ✓. For 9-40-41: 81 + 1600 = 1681 ✓. For 6-9-12: 36 + 81 = 117, not 144. For 13-13-15: 169 + 169 = 338, not 225.'],
        [282, 'Multiply the outside numbers and the radicals separately: (6 × 7)(√2 × √2) = 42 × 2 = 84.'],
        [293, 'The line is y = −2x + 8, which crosses the axes at (0, 8) and (4, 0). Area = ½ × 4 × 8 = 16.'],
        [309, 'In the worst case, you draw all 8 red socks first. Two more draws then have to be white, which gives a white pair. 8 + 2 = 10.'],
      ],
    },
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pageUrl = (L, slug) => `/questions/${LEVELS[L].word}-school-${slug}/`;
const SITE = 'https://sciencebowlpractice.org';

// "Stem W) a X) b Y) c Z) d" → { stem, choices: [[letter, text]] }
function splitChoices(q) {
  const m = q.match(/^(.*?)\s+W\)\s*(.*?)\s+X\)\s*(.*?)\s+Y\)\s*(.*?)\s+Z\)\s*(.*)$/s);
  if (!m) return { stem: q, choices: null };
  return { stem: m[1], choices: [['W', m[2]], ['X', m[3]], ['Y', m[4]], ['Z', m[5]]] };
}

function buildPage(L, subj) {
  const lv = LEVELS[L];
  const page = PAGES[L][subj.slug];
  const all = bank[L + subj.key];
  if (!all) throw new Error('missing bank ' + L + subj.key);
  const keys = Object.keys(all);
  const total = keys.length;

  const items = page.q.map(([idx, why], n) => {
    const q = keys[idx];
    if (!q) throw new Error(`${L} ${subj.slug}: no question at index ${idx}`);
    const ans = all[q];
    const { stem, choices } = splitChoices(q);
    let answerText = ans;
    if (choices) {
      const hit = choices.find(([, t]) => t.trim().toLowerCase() === String(ans).trim().toLowerCase());
      if (!hit) throw new Error(`${L} ${subj.slug} #${idx}: answer "${ans}" isn't one of the choices`);
      answerText = `${hit[0]}) ${hit[1]}`;
    }
    const type = choices ? 'MULTIPLE CHOICE' : 'SHORT ANSWER';
    return `
        <article class="sq" id="q${n + 1}">
          <p class="sq-meta">QUESTION ${n + 1} &#183; ${type}</p>
          <h2 class="sq-q">${esc(stem)}</h2>${choices ? `
          <ul class="sq-choices">
${choices.map(([l, t]) => `            <li><span class="sq-letter">${l})</span> ${esc(t)}</li>`).join('\n')}
          </ul>` : ''}
          <p class="sq-answer"><span class="sq-label">ANSWER</span> ${esc(answerText)}</p>
          <p class="sq-why"><span class="sq-label">WHY</span> ${esc(why)}</p>
        </article>`;
  }).join('\n');

  const n = page.q.length;
  const title = `${lv.label} Science Bowl ${subj.name} Questions & Answers`;
  const desc = `${n} real ${lv.label.toLowerCase()} Science Bowl ${subj.name.toLowerCase()} questions with answers and explanations, from official National Science Bowl sets.`;
  const url = SITE + pageUrl(L, subj.slug);
  const topicUrl = `/topics/${lv.word}-school-${subj.slug}/`;
  const practiceUrl = `/Practice/?level=${L}&amp;subject=${subj.key}`;
  const other = L === 'HS' ? 'MS' : 'HS';

  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: title,
      description: desc,
      url,
      learningResourceType: 'Practice questions',
      educationalLevel: `${lv.label} (grades ${lv.grades})`,
      about: { '@type': 'Thing', name: `Science Bowl ${subj.name}` },
      inLanguage: 'en',
      isAccessibleForFree: true,
      provider: { '@type': 'EducationalOrganization', name: 'Science Bowl Practice', url: SITE + '/' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Browse Questions', item: SITE + '/Browse/' },
        { '@type': 'ListItem', position: 3, name: `${lv.label} ${subj.name} Questions`, item: url },
      ],
    },
  ];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${esc(desc)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="Science Bowl Practice" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:image" content="${SITE}/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(desc)}" />
    <meta name="twitter:image" content="${SITE}/og-image.jpg" />
    <title>${esc(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/style.css" />
    <script src="/settings.js"></script>
    <script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
    </script>
  </head>
  <body>
    <canvas id="starfield"></canvas>
    <div id="scanlines"></div>

    <div class="page-wrap" style="--accent: ${lv.accent}">
      <div class="page-header">
        <a href="/Browse/" class="back-link">&#8592; BROWSE ALL QUESTIONS</a>
        <h1 class="page-title">${lv.label.toUpperCase()} ${subj.name.toUpperCase()} QUESTIONS</h1>
        <p class="page-sub">GRADES ${lv.grades} &#183; ${n} REAL QUESTIONS &#183; ANSWERS EXPLAINED</p>
      </div>

      <p class="topic-intro">
        ${subj.name} is one of the six Science Bowl subjects. At the ${lv.label.toLowerCase()} level it covers
        ${esc(page.covers)}. Below are ${n} real questions from official National Science Bowl
        sets, each with its answer and a short explanation of why it's right. There are
        ${total} ${lv.label.toLowerCase()} ${subj.name.toLowerCase()} questions in all on this site. When you're ready,
        <a href="${practiceUrl}">practise them against the clock</a> or review the
        <a href="${topicUrl}">${lv.label.toLowerCase()} ${subj.name.toLowerCase()} concepts</a>.
      </p>

      <div class="sq-list">
${items}
      </div>

      <section class="sq-tips" aria-labelledby="tips-title">
        <h2 class="shared-title" id="tips-title">${lv.label.toUpperCase()} ${subj.name.toUpperCase()} STUDY TIPS</h2>
        <ul>
${page.tips.map(t => `          <li>${esc(t)}</li>`).join('\n')}
        </ul>
        <p class="sq-source">All questions come from official National Science Bowl sample sets released by the
        U.S. Department of Energy. Explanations are written for this site.</p>
      </section>

      <div class="topic-nav">
        <div class="panel-label">MORE ${lv.label.toUpperCase()} QUESTIONS</div>
        <div class="topic-pills">
${SUBJECTS.filter(s => s.slug !== subj.slug).map(s => `          <a href="${pageUrl(L, s.slug)}" class="topic-pill">${s.name}</a>`).join('\n')}
        </div>
      </div>

      <div class="topic-nav">
        <div class="panel-label">KEEP GOING</div>
        <div class="topic-pills">
          <a href="${practiceUrl}" class="topic-pill">Practise ${subj.name} questions</a>
          <a href="${topicUrl}" class="topic-pill">${lv.label} ${subj.name} concepts</a>
          <a href="/LearnTopics-${L}/" class="topic-pill">${lv.label} flashcards</a>
          <a href="${pageUrl(other, subj.slug)}" class="topic-pill">${LEVELS[other].label} ${subj.name} questions</a>
        </div>
      </div>

      <footer>Science Bowl Practice &nbsp;&#183;&nbsp; KNOW THE ANSWER. KNOW WHY.</footer>
    </div>

    <script src="/starfield.js"></script>
  </body>
</html>
`;
}

let count = 0;
for (const L of Object.keys(LEVELS)) {
  for (const subj of SUBJECTS) {
    const html = buildPage(L, subj);
    const dir = path.join(ROOT, 'questions', `${LEVELS[L].word}-school-${subj.slug}`);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    count++;
  }
}
console.log('built', count, 'question pages');
