// ── Science words ────────────────────────────────────────────────────────────
// Vocabulary worth knowing, each with the word parts it's built from, so a
// student who learns "hydro = water" can decode words they've never seen.
// Shown in the WORDS tab of the study pages, and mixed into the flashcards
// when the "+ WORDS" toggle is on. Terms must not repeat a term in
// Flashcards.js for the same level, because "known" is tracked by term.
const WORDS = {
  HS: [
    // ── BIOLOGY (10) ──
    { term: "Hydrophobic", parts: "hydro (water) + phobic (fearing)", def: "Repels or doesn't mix with water, like oils and fats. The tails of membrane phospholipids are hydrophobic.", subject: "Biology" },
    { term: "Autotroph", parts: "auto (self) + troph (nourishment)", def: "An organism that makes its own food from light or chemicals, such as plants and algae.", subject: "Biology" },
    { term: "Heterotroph", parts: "hetero (other) + troph (nourishment)", def: "An organism that gets energy by eating other organisms, such as animals and fungi.", subject: "Biology" },
    { term: "Symbiosis", parts: "sym (together) + bio (life) + sis (state)", def: "A close, long-term relationship between two species. It can be mutualism, commensalism, or parasitism.", subject: "Biology" },
    { term: "Phagocytosis", parts: "phago (eat) + cyto (cell) + osis (process)", def: "A cell engulfing a large particle, such as a white blood cell swallowing a bacterium.", subject: "Biology" },
    { term: "Haploid", parts: "haplo (single) + oid (form)", def: "Having one set of chromosomes (n). Human eggs and sperm are haploid, with 23 chromosomes.", subject: "Biology" },
    { term: "Diploid", parts: "diplo (double) + oid (form)", def: "Having two sets of chromosomes (2n), one from each parent. Human body cells are diploid, with 46 chromosomes.", subject: "Biology" },
    { term: "Endotherm", parts: "endo (within) + therm (heat)", def: "An animal that keeps its body warm using its own metabolic heat, such as birds and mammals.", subject: "Biology" },
    { term: "Pathogen", parts: "patho (disease) + gen (producer)", def: "Anything that causes disease, such as a virus, bacterium, fungus, or parasite.", subject: "Biology" },
    { term: "Hypertonic", parts: "hyper (above) + tonic (tension)", def: "A solution with a higher solute concentration than the cell. Water leaves the cell, so it shrinks.", subject: "Biology" },

    // ── CHEMISTRY (10) ──
    { term: "Isomer", parts: "iso (equal) + mer (part)", def: "Compounds with the same molecular formula but a different arrangement of atoms, like glucose and fructose.", subject: "Chemistry" },
    { term: "Allotrope", parts: "allo (other) + trope (way)", def: "A different structural form of the same element. Diamond, graphite, and graphene are allotropes of carbon.", subject: "Chemistry" },
    { term: "Amphoteric", parts: "amphoteros (both)", def: "Able to act as either an acid or a base. Water and aluminum oxide are amphoteric.", subject: "Chemistry" },
    { term: "Hygroscopic", parts: "hygro (moisture) + scopic (watching)", def: "Readily absorbs water vapor from the air, like table salt, silica gel, or concentrated sulfuric acid.", subject: "Chemistry" },
    { term: "Exergonic", parts: "exo (out) + ergon (work)", def: "A reaction that releases free energy (ΔG < 0), so it happens spontaneously.", subject: "Chemistry" },
    { term: "Hydrolysis", parts: "hydro (water) + lysis (splitting)", def: "Breaking a chemical bond by adding water. It's how the body digests proteins and carbohydrates.", subject: "Chemistry" },
    { term: "Monomer", parts: "mono (one) + mer (part)", def: "A small molecule that links with others to form a polymer, like glucose in starch or amino acids in proteins.", subject: "Chemistry" },
    { term: "Sublimation", parts: "sublimare (to raise up)", def: "A solid turning directly into a gas without melting first, like dry ice (solid CO₂).", subject: "Chemistry" },
    { term: "Anion", parts: "ana (up) + ion (going)", def: "A negatively charged ion, which has gained electrons, such as Cl⁻. It moves toward the anode.", subject: "Chemistry" },
    { term: "Cation", parts: "kata (down) + ion (going)", def: "A positively charged ion, which has lost electrons, such as Na⁺. It moves toward the cathode.", subject: "Chemistry" },

    // ── PHYSICS (10) ──
    { term: "Adiabatic", parts: "a (not) + dia (through) + batos (passable)", def: "A process with no heat exchanged with the surroundings. Rapidly compressing a gas heats it adiabatically.", subject: "Physics" },
    { term: "Isothermal", parts: "iso (equal) + therm (heat)", def: "A process that happens at constant temperature. For an ideal gas, PV stays constant.", subject: "Physics" },
    { term: "Isobaric", parts: "iso (equal) + baros (weight, pressure)", def: "A process that happens at constant pressure. The work done equals PΔV.", subject: "Physics" },
    { term: "Kinematics", parts: "kinema (motion)", def: "The branch of mechanics that describes motion (position, velocity, acceleration) without looking at the forces causing it.", subject: "Physics" },
    { term: "Dielectric", parts: "dia (through) + electric", def: "An insulator that becomes polarized in an electric field. Placing one between capacitor plates increases capacitance.", subject: "Physics" },
    { term: "Piezoelectric", parts: "piezein (to press) + electric", def: "Producing a voltage when squeezed, or bending when a voltage is applied. Quartz in watches is piezoelectric.", subject: "Physics" },
    { term: "Ferromagnetic", parts: "ferrum (iron) + magnetic", def: "Strongly attracted to magnets and able to become a permanent magnet, like iron, nickel, and cobalt.", subject: "Physics" },
    { term: "Diamagnetic", parts: "dia (against) + magnetic", def: "Weakly repelled by a magnetic field. Water, copper, and bismuth are diamagnetic.", subject: "Physics" },
    { term: "Hydrostatic", parts: "hydro (water) + static (standing)", def: "About fluids at rest. Hydrostatic pressure at depth h is P = ρgh.", subject: "Physics" },
    { term: "Monochromatic", parts: "mono (one) + chroma (color)", def: "Light of a single wavelength or color. Lasers produce nearly monochromatic light.", subject: "Physics" },

    // ── EARTH SCIENCE (10) ──
    { term: "Lithosphere", parts: "litho (stone) + sphere (ball)", def: "Earth's rigid outer shell, made of the crust and uppermost mantle, broken into tectonic plates.", subject: "Earth Science" },
    { term: "Asthenosphere", parts: "asthenes (weak) + sphere", def: "The hot, soft, slowly flowing layer of the upper mantle that the tectonic plates ride on.", subject: "Earth Science" },
    { term: "Perihelion", parts: "peri (near) + helios (sun)", def: "The point in an orbit closest to the Sun. Earth reaches perihelion in early January.", subject: "Earth Science" },
    { term: "Aphelion", parts: "apo (away) + helios (sun)", def: "The point in an orbit farthest from the Sun. Earth reaches aphelion in early July.", subject: "Earth Science" },
    { term: "Isobar", parts: "iso (equal) + baros (weight, pressure)", def: "A line on a weather map connecting places with equal air pressure. Closely spaced isobars mean strong winds.", subject: "Earth Science" },
    { term: "Seismograph", parts: "seismo (shaking) + graph (writing)", def: "An instrument that detects and records ground motion from earthquakes.", subject: "Earth Science" },
    { term: "Pyroclastic", parts: "pyro (fire) + clastic (broken)", def: "Made of fragments of rock and ash blasted out by a volcano. A pyroclastic flow is a fast, deadly avalanche of hot gas and debris.", subject: "Earth Science" },
    { term: "Bathymetry", parts: "bathy (deep) + metry (measuring)", def: "Measuring and mapping the depth and shape of the ocean floor, often with sonar.", subject: "Earth Science" },
    { term: "Orographic Lift", parts: "oro (mountain) + graphic (describing)", def: "Air forced up a mountain cools and drops rain on the windward side, leaving a dry rain shadow on the other side.", subject: "Earth Science" },
    { term: "Heliocentric", parts: "helio (sun) + centric (center)", def: "A model with the Sun at the center of the solar system, proposed by Copernicus.", subject: "Earth Science" },

    // ── ENERGY (10) ──
    { term: "Thermoelectric", parts: "thermo (heat) + electric", def: "Turning a temperature difference directly into voltage (the Seebeck effect). Spacecraft RTGs use it to make power from radioactive decay heat.", subject: "Energy" },
    { term: "Anthropogenic", parts: "anthropo (human) + genic (produced by)", def: "Caused by human activity, such as anthropogenic carbon dioxide emissions from burning fossil fuels.", subject: "Energy" },
    { term: "Fissile", parts: "fissilis (able to be split)", def: "Able to sustain a nuclear chain reaction with slow neutrons. Uranium-235 and plutonium-239 are fissile.", subject: "Energy" },
    { term: "Hydrocarbon", parts: "hydro(gen) + carbon", def: "A compound made only of hydrogen and carbon. Methane, propane, and octane are hydrocarbons found in fossil fuels.", subject: "Energy" },
    { term: "Biofuel", parts: "bio (life) + fuel", def: "Fuel made from recently living material, such as ethanol from corn or biodiesel from vegetable oil.", subject: "Energy" },
    { term: "Cogeneration", parts: "co (together) + generation", def: "Producing electricity and useful heat from the same fuel at once (combined heat and power), which raises overall efficiency.", subject: "Energy" },
    { term: "Insolation", parts: "in(coming) + sol(ar) + (radi)ation", def: "The amount of solar radiation reaching a given area. It's highest near the equator and in summer.", subject: "Energy" },
    { term: "Turbine", parts: "turbo (spinning, whirl)", def: "A machine whose blades are spun by moving steam, water, wind, or gas, turning a generator to make electricity.", subject: "Energy" },
    { term: "Radioisotope", parts: "radio (ray) + iso (equal) + tope (place)", def: "An unstable isotope that emits radiation as it decays. Used in medicine, smoke detectors, and spacecraft power.", subject: "Energy" },
    { term: "Megawatt", parts: "mega (great, million) + watt", def: "One million watts. A large power plant produces around 1,000 megawatts; a big wind turbine produces a few.", subject: "Energy" },

    // ── MATH (10) ──
    { term: "Hypotenuse", parts: "hypo (under) + teinousa (stretching)", def: "The longest side of a right triangle, opposite the right angle. c in a² + b² = c².", subject: "Math" },
    { term: "Isosceles", parts: "iso (equal) + skelos (leg)", def: "A triangle with at least two equal sides. The angles opposite those sides are also equal.", subject: "Math" },
    { term: "Polyhedron", parts: "poly (many) + hedron (face)", def: "A 3D solid with flat polygon faces, like a cube or pyramid. For convex ones, V − E + F = 2.", subject: "Math" },
    { term: "Trigonometry", parts: "tri (three) + gon (angle) + metry (measuring)", def: "The study of the relationships between the angles and sides of triangles, using sine, cosine, and tangent.", subject: "Math" },
    { term: "Collinear", parts: "co (together) + linear (line)", def: "Points that all lie on the same straight line.", subject: "Math" },
    { term: "Orthogonal", parts: "ortho (right, straight) + gon (angle)", def: "At right angles; perpendicular. Two vectors are orthogonal when their dot product is zero.", subject: "Math" },
    { term: "Bisector", parts: "bi (two) + sector (cutter)", def: "A line or ray that cuts an angle or segment into two equal parts.", subject: "Math" },
    { term: "Equilateral", parts: "equi (equal) + lateral (side)", def: "Having all sides equal. Each angle of an equilateral triangle is 60°.", subject: "Math" },
    { term: "Concentric", parts: "con (together) + centric (center)", def: "Circles or shapes that share the same center but have different sizes.", subject: "Math" },
    { term: "Supplementary Angles", parts: "supplere (to fill up)", def: "Two angles that add up to 180°. Complementary angles add up to 90°.", subject: "Math" },
  ],

  MS: [
    // ── BIOLOGY (10) ──
    { term: "Herbivore", parts: "herbi (plant) + vore (eater)", def: "An animal that eats only plants, such as a deer or rabbit.", subject: "Biology" },
    { term: "Carnivore", parts: "carni (flesh) + vore (eater)", def: "An animal that eats mostly other animals, such as a lion or shark.", subject: "Biology" },
    { term: "Omnivore", parts: "omni (all) + vore (eater)", def: "An animal that eats both plants and animals, such as a bear or a human.", subject: "Biology" },
    { term: "Microorganism", parts: "micro (small) + organism", def: "A living thing too small to see without a microscope, such as bacteria and many protists.", subject: "Biology" },
    { term: "Chlorophyll", parts: "chloro (green) + phyll (leaf)", def: "The green pigment in chloroplasts that absorbs light for photosynthesis.", subject: "Biology" },
    { term: "Cytoplasm", parts: "cyto (cell) + plasm (formed material)", def: "The jelly-like fluid inside a cell that surrounds the organelles.", subject: "Biology" },
    { term: "Symbiosis", parts: "sym (together) + bio (life) + sis (state)", def: "A close relationship between two different species living together, like bees and flowers.", subject: "Biology" },
    { term: "Parasite", parts: "para (beside) + site (food)", def: "An organism that lives on or in a host and harms it, such as a tick or tapeworm.", subject: "Biology" },
    { term: "Exoskeleton", parts: "exo (outside) + skeleton", def: "A hard outer covering that supports and protects an animal, like the shell of an insect or crab.", subject: "Biology" },
    { term: "Metamorphosis", parts: "meta (change) + morph (shape) + osis (process)", def: "A big change in body form during growth, like a caterpillar becoming a butterfly or a tadpole becoming a frog.", subject: "Biology" },

    // ── CHEMISTRY (10) ──
    { term: "Hydrogen", parts: "hydro (water) + gen (maker)", def: "The lightest and most common element in the universe (atomic number 1). It forms water when it burns.", subject: "Chemistry" },
    { term: "Insoluble", parts: "in (not) + soluble (able to dissolve)", def: "Not able to dissolve in a particular liquid. Sand is insoluble in water.", subject: "Chemistry" },
    { term: "Diatomic", parts: "di (two) + atomic", def: "A molecule made of two atoms. Hydrogen (H₂), oxygen (O₂), and nitrogen (N₂) exist as diatomic molecules.", subject: "Chemistry" },
    { term: "Sublimation", parts: "sublimare (to raise up)", def: "A solid turning straight into a gas without becoming a liquid, like dry ice.", subject: "Chemistry" },
    { term: "Viscosity", parts: "viscum (sticky)", def: "How thick a liquid is, or how much it resists flowing. Honey has a higher viscosity than water.", subject: "Chemistry" },
    { term: "Volatile", parts: "volare (to fly)", def: "Evaporating easily at room temperature, like rubbing alcohol or gasoline.", subject: "Chemistry" },
    { term: "Malleable", parts: "malleus (hammer)", def: "Able to be hammered or pressed into thin sheets without breaking. Most metals, like gold and aluminum, are malleable.", subject: "Chemistry" },
    { term: "Ductile", parts: "ducere (to lead, draw out)", def: "Able to be stretched into a thin wire. Copper is ductile, which is why it's used in electrical wires.", subject: "Chemistry" },
    { term: "Homogeneous", parts: "homo (same) + gene (kind)", def: "A mixture that looks the same throughout, like salt water or air.", subject: "Chemistry" },
    { term: "Heterogeneous", parts: "hetero (different) + gene (kind)", def: "A mixture where you can see the different parts, like trail mix or sand in water.", subject: "Chemistry" },

    // ── PHYSICS (10) ──
    { term: "Thermometer", parts: "thermo (heat) + meter (measure)", def: "A tool that measures temperature.", subject: "Physics" },
    { term: "Telescope", parts: "tele (far) + scope (look)", def: "An instrument that uses lenses or mirrors to make faraway objects look closer.", subject: "Physics" },
    { term: "Hydraulic", parts: "hydro (water) + aulos (pipe)", def: "Using a liquid under pressure to move or lift things, like a car lift or excavator arm.", subject: "Physics" },
    { term: "Transparent", parts: "trans (through) + parent (appearing)", def: "Lets light pass straight through so you can see clearly through it, like clear glass.", subject: "Physics" },
    { term: "Translucent", parts: "trans (through) + lucent (shining)", def: "Lets some light through but scatters it, so you can't see clearly through it, like frosted glass or wax paper.", subject: "Physics" },
    { term: "Opaque", parts: "opacus (shaded)", def: "Blocks all light, so you can't see through it, like wood or metal.", subject: "Physics" },
    { term: "Concave", parts: "con (completely) + cave (hollow)", def: "Curved inward like the inside of a bowl. A concave lens spreads light rays apart.", subject: "Physics" },
    { term: "Convex", parts: "convexus (arched)", def: "Curved outward like the back of a spoon. A convex lens brings light rays together and is used in magnifying glasses.", subject: "Physics" },
    { term: "Decibel", parts: "deci (one tenth) + bel (after Alexander Graham Bell)", def: "The unit for measuring how loud a sound is. Every 10 decibels is 10 times more intense.", subject: "Physics" },
    { term: "Ultrasound", parts: "ultra (beyond) + sound", def: "Sound with a frequency too high for humans to hear (above 20,000 Hz). Used by bats and for medical imaging.", subject: "Physics" },

    // ── EARTH SCIENCE (10) ──
    { term: "Geology", parts: "geo (earth) + logy (study of)", def: "The study of Earth's rocks, minerals, and the processes that shape them.", subject: "Earth Science" },
    { term: "Meteorology", parts: "meteoro (high in the air) + logy (study of)", def: "The study of the atmosphere and weather. It's about weather, not meteors!", subject: "Earth Science" },
    { term: "Seismic", parts: "seismo (shaking)", def: "Related to earthquakes or vibrations of the Earth. Seismic waves travel through the ground after an earthquake.", subject: "Earth Science" },
    { term: "Hemisphere", parts: "hemi (half) + sphere (ball)", def: "Half of Earth, split by the equator (Northern and Southern) or by the prime meridian (Eastern and Western).", subject: "Earth Science" },
    { term: "Equinox", parts: "equi (equal) + nox (night)", def: "One of two days a year, in March and September, when day and night are about equally long everywhere.", subject: "Earth Science" },
    { term: "Solstice", parts: "sol (sun) + stice (standing still)", def: "The longest or shortest day of the year, in June and December, when the Sun reaches its highest or lowest noon point.", subject: "Earth Science" },
    { term: "Stalactite", parts: "stalaktos (dripping)", def: "A mineral formation hanging from a cave ceiling. Stalagmites grow up from the floor. Tip: stalactites hold \"tight\" to the ceiling.", subject: "Earth Science" },
    { term: "Topography", parts: "topo (place) + graphy (drawing)", def: "The shape and height of the land surface. Topographic maps use contour lines to show elevation.", subject: "Earth Science" },
    { term: "Barometer", parts: "baro (weight, pressure) + meter (measure)", def: "An instrument that measures air pressure. Falling pressure often means stormy weather is coming.", subject: "Earth Science" },
    { term: "Hydrosphere", parts: "hydro (water) + sphere", def: "All the water on Earth, including oceans, lakes, rivers, groundwater, ice, and water vapor.", subject: "Earth Science" },

    // ── ENERGY (10) ──
    { term: "Photovoltaic", parts: "photo (light) + voltaic (electric, after Volta)", def: "Turning sunlight directly into electricity. Solar panels are made of photovoltaic cells.", subject: "Energy" },
    { term: "Kilowatt", parts: "kilo (thousand) + watt", def: "One thousand watts. Electric bills charge by the kilowatt-hour, which is using 1,000 watts for one hour.", subject: "Energy" },
    { term: "Biofuel", parts: "bio (life) + fuel", def: "Fuel made from plants or other living material, like ethanol made from corn.", subject: "Energy" },
    { term: "Hydrocarbon", parts: "hydro(gen) + carbon", def: "A compound made of only hydrogen and carbon. Gasoline, propane, and natural gas are hydrocarbons.", subject: "Energy" },
    { term: "Thermostat", parts: "thermo (heat) + stat (keeping still)", def: "A device that keeps a room at a set temperature by turning heating or cooling on and off.", subject: "Energy" },
    { term: "Fission", parts: "fissio (splitting)", def: "Splitting a heavy atom's nucleus into smaller pieces, releasing energy. Nuclear power plants use fission.", subject: "Energy" },
    { term: "Fusion", parts: "fusio (melting together)", def: "Joining light atomic nuclei into a heavier one, releasing huge amounts of energy. Fusion powers the Sun.", subject: "Energy" },
    { term: "Emissions", parts: "emittere (to send out)", def: "Gases and particles released into the air, such as carbon dioxide from car exhaust or power plants.", subject: "Energy" },
    { term: "Sustainable", parts: "sustinere (to hold up)", def: "Able to continue for a long time without using up resources or harming the environment.", subject: "Energy" },
    { term: "Radioactive", parts: "radio (ray) + active", def: "Giving off radiation as unstable atoms break down. Uranium is radioactive.", subject: "Energy" },

    // ── MATH (10) ──
    { term: "Polygon", parts: "poly (many) + gon (angle)", def: "A flat, closed shape made of straight sides, like a triangle, square, or hexagon.", subject: "Math" },
    { term: "Diameter", parts: "dia (across) + meter (measure)", def: "A straight line through the center of a circle from one side to the other. It's twice the radius.", subject: "Math" },
    { term: "Radius", parts: "radius (ray, spoke of a wheel)", def: "The distance from the center of a circle to its edge. It's half the diameter.", subject: "Math" },
    { term: "Circumference", parts: "circum (around) + ference (carrying)", def: "The distance around a circle. C = πd, or C = 2πr.", subject: "Math" },
    { term: "Equilateral", parts: "equi (equal) + lateral (side)", def: "Having all sides the same length. An equilateral triangle also has three 60° angles.", subject: "Math" },
    { term: "Isosceles", parts: "iso (equal) + skelos (leg)", def: "A triangle with at least two sides the same length.", subject: "Math" },
    { term: "Quotient", parts: "quotiens (how many times)", def: "The answer to a division problem. In 12 ÷ 3 = 4, the quotient is 4.", subject: "Math" },
    { term: "Numerator", parts: "numerare (to count)", def: "The top number of a fraction. It counts how many parts you have.", subject: "Math" },
    { term: "Denominator", parts: "denominare (to name)", def: "The bottom number of a fraction. It names how many equal parts make a whole.", subject: "Math" },
    { term: "Hypotenuse", parts: "hypo (under) + teinousa (stretching)", def: "The longest side of a right triangle, across from the right angle.", subject: "Math" },
  ],
};
