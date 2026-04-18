const CONCEPTS = {
  Biology: {
    color: "var(--green)",
    icon: "🧬",
    items: [
      {
        term: "Mitochondria",
        def: "Double-membraned organelle that produces ATP via aerobic cellular respiration. The Krebs cycle runs in the matrix; the electron transport chain runs on the inner membrane (cristae). Contains its own circular DNA, evidence of endosymbiotic origin.",
        keywords: ["mitochondri", "krebs", "cristae"]
      },
      {
        term: "Mitosis",
        def: "Nuclear division producing two genetically identical diploid daughter cells. Phases (PMAT): Prophase (chromatin condenses), Metaphase (chromosomes align at cell plate), Anaphase (sister chromatids separate), Telophase (nuclei reform). Used for growth and repair.",
        keywords: ["mitosis", "metaphase", "anaphase", "prophase", "telophase", "sister chromatid"]
      },
      {
        term: "Meiosis",
        def: "Two-stage division producing four haploid gametes with genetic variation. Crossing over (recombination) occurs during Prophase I. Meiosis I separates homologous pairs; Meiosis II separates sister chromatids. Results in genetic diversity.",
        keywords: ["meiosis", "haploid", "gamete", "crossing over", "homologous"]
      },
      {
        term: "Central Dogma",
        def: "DNA → RNA → Protein. Transcription: RNA polymerase reads the template DNA strand to produce mRNA in the nucleus. Translation: ribosomes read mRNA codons and tRNA anticodons to assemble polypeptides. rRNA is synthesized in the nucleolus.",
        keywords: ["transcription", "translation", "mrna", "trna", "rna polymerase", "codon", "nucleolus"]
      },
      {
        term: "Enzymes",
        def: "Protein catalysts that lower activation energy without being consumed. Substrates bind at the active site. Classes: oxidoreductase (redox), hydrolase (water addition), transferase (group transfer), lyase (bond breaking without water), isomerase, ligase.",
        keywords: ["enzyme", "catalyst", "active site", "substrate", "hydrolase", "oxidoreductase", "transferase", "lyase"]
      },
      {
        term: "Photosynthesis",
        def: "Converts light energy to chemical energy in chloroplasts. Light reactions (thylakoid membranes): split water, produce ATP and NADPH, release O₂. Calvin cycle (stroma): fixes CO₂ into G3P using ATP and NADPH. Net: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.",
        keywords: ["photosynthes", "chloroplast", "calvin cycle", "thylakoid", "stroma", "chlorophyll"]
      },
      {
        term: "Cellular Respiration",
        def: "Breaks down glucose to ATP: Glycolysis (cytoplasm, 2 net ATP), Krebs/Citric Acid Cycle (matrix, 2 ATP), Electron Transport Chain (inner membrane, ~32 ATP). Anaerobic fermentation produces lactic acid (animals) or ethanol + CO₂ (yeast).",
        keywords: ["glycolysis", "krebs cycle", "electron transport", "fermentation", "pyruvate", "nadh", "lactic acid"]
      },
      {
        term: "Mendelian Genetics",
        def: "Dominant alleles mask recessive ones in heterozygotes. F2 monohybrid cross: 3:1 phenotype ratio. Dihybrid cross (F2): 9:3:3:1 ratio. Law of Segregation: allele pairs separate during gamete formation. Law of Independent Assortment: genes on different chromosomes assort independently.",
        keywords: ["dominant", "recessive", "allele", "phenotype", "genotype", "heterozygous", "homozygous"]
      },
      {
        term: "Ecological Relationships",
        def: "Mutualism (+/+): both benefit. Commensalism (+/0): one benefits, other unaffected. Parasitism (+/−): parasite benefits, host is harmed. Competition (−/−): both harmed. Predation (+/−): predator benefits. Niche: the ecological role of an organism in its community.",
        keywords: ["mutualism", "commensalism", "parasitism", "symbiosis", "predation", "competition", "niche"]
      },
      {
        term: "Domains & Classification",
        def: "Three domains: Bacteria (no nucleus, peptidoglycan cell walls, single RNA polymerase), Archaea (no nucleus, no peptidoglycan, multiple RNA polymerases, can have introns), Eukarya (nucleus, complex organelles). Six-kingdom system places Monera, Protista, Fungi, Plantae, and Animalia under domains.",
        keywords: ["archaea", "bacteria", "domain", "eubacteri", "prokaryote", "eukaryote", "peptidoglycan"]
      },
      {
        term: "Cell Organelles",
        def: "Nucleus: DNA storage and transcription. Ribosome: protein synthesis (80S in eukaryotes, 70S in prokaryotes). Rough ER: protein folding with ribosomes. Smooth ER: lipid synthesis. Golgi: modifies and packages proteins. Lysosome: hydrolytic digestion. Vacuole: storage (large in plant cells).",
        keywords: ["golgi", "lysosome", "endoplasmic reticulum", "ribosom", "vacuol", "cell wall"]
      },
      {
        term: "Nervous System",
        def: "CNS (brain + spinal cord) processes information. PNS: sensory (afferent) carries signals to CNS; motor (efferent) carries signals away. Neurons transmit via action potentials (all-or-nothing); neurotransmitters cross the synaptic cleft. Reflex arcs bypass the brain for fast responses.",
        keywords: ["neuron", "neurotransmitter", "synapse", "axon", "dendrite", "reflex", "action potential"]
      },
      {
        term: "Cell Membrane",
        def: "Fluid mosaic model: phospholipid bilayer with embedded proteins. Hydrophilic heads face outward; hydrophobic tails face inward. Selectively permeable — small nonpolar molecules pass freely, large or charged molecules require transport proteins. Cholesterol stabilizes membrane fluidity.",
        keywords: ["fluid mosaic", "phospholipid", "membrane", "selectively permeable", "cholesterol", "transport protein"]
      },
      {
        term: "Osmosis & Diffusion",
        def: "Diffusion: net movement of molecules from high to low concentration (passive, no energy). Osmosis: diffusion of water across a semipermeable membrane toward higher solute concentration. Hypertonic solution: cell loses water (crenation in animals, plasmolysis in plants). Hypotonic: cell gains water.",
        keywords: ["osmosis", "diffusion", "hypertonic", "hypotonic", "isotonic", "concentration gradient", "plasmolysis"]
      },
      {
        term: "Circulatory System",
        def: "Heart has 4 chambers: right atrium → right ventricle → lungs (pulmonary circuit) → left atrium → left ventricle → body (systemic circuit). Oxygenated blood enters the left atrium via pulmonary veins. Arteries carry blood away from heart; veins return blood to heart.",
        keywords: ["heart", "atrium", "ventricle", "circulatory", "artery", "vein", "pulmonary", "systemic"]
      },
      {
        term: "Immune System",
        def: "Innate immunity: non-specific (skin barrier, phagocytes, inflammation). Adaptive immunity: specific responses. B cells produce antibodies (humoral immunity). T cells: helper T cells (CD4+) coordinate response; cytotoxic T cells (CD8+) kill infected cells. Memory cells enable faster secondary responses.",
        keywords: ["immune", "antibody", "b cell", "t cell", "antigen", "phagocyte", "lymphocyte", "adaptive", "innate"]
      },
      {
        term: "Endocrine System",
        def: "Glands secrete hormones into the bloodstream. Hypothalamus controls the pituitary (master gland). Key glands: thyroid (thyroxine — metabolism), adrenal (epinephrine, cortisol — stress), pancreas (insulin lowers blood glucose; glucagon raises it), gonads (sex hormones).",
        keywords: ["hormone", "endocrine", "pituitary", "thyroid", "insulin", "glucagon", "adrenal", "hypothalamus"]
      },
      {
        term: "Digestive System",
        def: "Mechanical and chemical breakdown of food. Mouth (amylase), esophagus, stomach (pepsin, HCl, pH ~2), small intestine (site of most absorption; villi and microvilli increase surface area), large intestine (water reabsorption). Liver produces bile; pancreas secretes digestive enzymes and bicarbonate.",
        keywords: ["digestive", "stomach", "small intestine", "bile", "pancreas", "amylase", "pepsin", "liver", "villi"]
      },
      {
        term: "Respiratory System",
        def: "Oxygen enters via nose/mouth → trachea → bronchi → bronchioles → alveoli (site of gas exchange). CO₂ diffuses out; O₂ diffuses into capillaries. Hemoglobin in red blood cells carries O₂ as oxyhemoglobin. Diaphragm contraction increases lung volume (inhalation = active process).",
        keywords: ["lung", "alveoli", "bronchi", "trachea", "hemoglobin", "respiratory", "diaphragm", "gas exchange"]
      },
      {
        term: "Excretory System",
        def: "Kidneys filter blood to produce urine. Functional unit: nephron. Glomerulus (capillary ball in Bowman's capsule) filters blood by pressure. Loop of Henle concentrates filtrate. Collecting duct reabsorbs water (regulated by ADH). Nitrogenous wastes: urea (mammals), uric acid (birds/reptiles), ammonia (fish).",
        keywords: ["kidney", "nephron", "glomerulus", "urea", "excretory", "bowman", "loop of henle", "filtration"]
      },
      {
        term: "Viruses",
        def: "Non-living infectious agents consisting of nucleic acid (DNA or RNA) surrounded by a protein coat (capsid); some have a lipid envelope. Lytic cycle: virus hijacks host, replicates, lyses cell (releases new viruses). Lysogenic cycle: viral DNA integrates into host genome (prophage) and replicates with host.",
        keywords: ["virus", "capsid", "lytic", "lysogenic", "bacteriophage", "retrovirus", "rna virus", "viral"]
      },
      {
        term: "Population Genetics",
        def: "Hardy-Weinberg equilibrium: allele frequencies stable if no mutation, migration, genetic drift, natural selection, or non-random mating. Equations: p + q = 1; p² + 2pq + q² = 1. Natural selection acts on phenotypes (determined by genotypes). Genetic drift: random allele frequency change in small populations.",
        keywords: ["hardy-weinberg", "allele frequency", "genetic drift", "natural selection", "population genetics", "gene pool"]
      },
      {
        term: "Plant Structure & Reproduction",
        def: "Vascular plants have xylem (water/minerals upward) and phloem (sugars bidirectionally). Angiosperms (flowering plants) produce seeds in fruit; gymnosperms produce naked seeds (cones). Monocots: parallel leaf veins, fibrous roots; dicots: branching veins, taproot. Bryophytes (mosses) lack vascular tissue.",
        keywords: ["xylem", "phloem", "angiosperm", "gymnosperm", "monocot", "dicot", "bryophyte", "vascular", "stamen", "pistil"]
      },
      {
        term: "Muscle Tissue",
        def: "Skeletal muscle: striated, voluntary, attached to bones via tendons, multinucleated. Smooth muscle: non-striated, involuntary, found in organ walls and blood vessels. Cardiac muscle: striated, involuntary, found only in the heart, connected by intercalated discs. Sarcomere is the basic contractile unit.",
        keywords: ["skeletal muscle", "smooth muscle", "cardiac muscle", "sarcomere", "actin", "myosin", "muscle tissue"]
      },
      {
        term: "Homeostasis",
        def: "Maintenance of stable internal conditions despite external changes. Negative feedback: response opposes the stimulus (e.g., insulin lowers high blood glucose). Positive feedback: response amplifies the stimulus (e.g., oxytocin during childbirth, blood clotting). Temperature, pH, and blood glucose are key regulated variables.",
        keywords: ["homeostasis", "negative feedback", "positive feedback", "thermoregulation", "blood glucose", "pH regulation"]
      },
      {
        term: "DNA Structure",
        def: "Double helix: two antiparallel strands of nucleotides. Each nucleotide: deoxyribose sugar, phosphate group, nitrogenous base. Complementary base pairing: A–T (2 hydrogen bonds), G–C (3 hydrogen bonds). 5'→3' directionality. Chargaff's rule: %A = %T and %G = %C in any organism.",
        keywords: ["dna structure", "double helix", "base pair", "adenine", "thymine", "guanine", "cytosine", "nucleotide", "chargaff"]
      },
      {
        term: "Evolution & Natural Selection",
        def: "Natural selection: heritable variation + differential reproductive success = adaptation over generations. Darwin's observations: overproduction, variation, heritability, differential survival. Speciation: allopatric (geographic isolation) vs sympatric. Evidence: fossil record, homologous structures, molecular phylogenetics.",
        keywords: ["natural selection", "evolution", "speciation", "adaptation", "fitness", "darwin", "allopatric", "homologous structure"]
      }
    ]
  },

  Chemistry: {
    color: "var(--cyan)",
    icon: "⚗️",
    items: [
      {
        term: "Atomic Structure",
        def: "Protons (+) and neutrons (neutral) in nucleus; electrons (−) in orbitals. Atomic number = protons; mass number = protons + neutrons. Isotopes: same element, different neutron count. Ions: gained electrons = anion (−); lost electrons = cation (+). Electron configuration follows Aufbau principle.",
        keywords: ["proton", "neutron", "electron", "isotope", "atomic number", "atomic mass", "orbital", "valence"]
      },
      {
        term: "Periodic Trends",
        def: "Atomic radius decreases across a period (more protons pull electrons in) and increases down a group (more electron shells). Electronegativity and ionization energy increase across a period, decrease down a group. Electron affinity follows similar trends. Noble gases have the highest ionization energies per period.",
        keywords: ["electronegativity", "ionization energy", "atomic radius", "periodic trend", "electron affinity", "noble gas"]
      },
      {
        term: "Chemical Bonding",
        def: "Ionic: metal + nonmetal, electron transfer, forms crystal lattice. Covalent: nonmetal + nonmetal, electron sharing. Polar covalent: unequal sharing. Metallic: delocalized electron sea. Bond strength order (single < double < triple). Octet rule: atoms gain/lose/share electrons to achieve 8 valence electrons.",
        keywords: ["ionic bond", "covalent bond", "polar", "metallic bond", "octet rule", "valence electron"]
      },
      {
        term: "Gas Laws",
        def: "Boyle's Law: P₁V₁ = P₂V₂ (constant T). Charles' Law: V₁/T₁ = V₂/T₂ (constant P). Gay-Lussac's: P₁/T₁ = P₂/T₂ (constant V). Ideal Gas Law: PV = nRT (R = 8.314 J/mol·K). Avogadro's: at same T and P, equal volumes contain equal numbers of moles.",
        keywords: ["boyle", "charles", "ideal gas", "avogadro", "gas law", "pv=nrt", "gay-lussac"]
      },
      {
        term: "Acids & Bases",
        def: "Arrhenius: acid produces H⁺, base produces OH⁻. Brønsted-Lowry: acid donates proton, base accepts proton. Lewis: acid accepts electron pair. pH = −log[H⁺]; strong acids fully dissociate (HCl, HNO₃, H₂SO₄, HBr, HI, HClO₄). Conjugate acid-base pairs differ by one H⁺.",
        keywords: ["acid", "base", "ph", "proton", "hydroxide", "neutralization", "bronsted", "arrhenius", "titration"]
      },
      {
        term: "Thermochemistry",
        def: "Enthalpy (ΔH): heat at constant pressure; exothermic ΔH < 0, endothermic ΔH > 0. Entropy (ΔS): disorder. Gibbs free energy: ΔG = ΔH − TΔS; spontaneous if ΔG < 0. Hess's Law: enthalpy is path-independent (state function). Standard enthalpy of formation: ΔHf° for 1 mol from elements in standard state.",
        keywords: ["enthalpy", "entropy", "gibbs", "exothermic", "endothermic", "hess", "spontaneous", "calorimetry"]
      },
      {
        term: "Reaction Kinetics",
        def: "Rate depends on concentration, temperature, surface area, and catalysts. Activation energy (Eₐ): minimum energy for reaction. Arrhenius equation: k = Ae^(−Eₐ/RT). Rate law: rate = k[A]^m[B]^n (determined experimentally). Half-life (t½): time for half of reactant to be consumed; constant for first-order reactions.",
        keywords: ["activation energy", "catalyst", "reaction rate", "kinetics", "rate law", "half-life", "arrhenius equation"]
      },
      {
        term: "Electrochemistry",
        def: "OIL RIG: Oxidation Is Loss, Reduction Is Gain of electrons. Galvanic (voltaic) cell: spontaneous redox; anode (oxidation, −) and cathode (reduction, +). Electrolytic cell: non-spontaneous, driven by external current. EMF (cell potential) measured in volts. Nernst equation relates EMF to concentration.",
        keywords: ["oxidation", "reduction", "redox", "anode", "cathode", "galvanic", "electrolysis", "oxidation state"]
      },
      {
        term: "Chemical Equilibrium",
        def: "Dynamic state where forward = reverse reaction rate. Le Chatelier's Principle: system shifts to oppose any stress. Kc = [products]/[reactants] (excludes solids and pure liquids). Kp relates to partial pressures of gases. Q vs K: Q < K → shifts right; Q > K → shifts left.",
        keywords: ["equilibrium", "le chatelier", "equilibrium constant", "kc", "kp", "reversible reaction", "q vs k"]
      },
      {
        term: "Solutions & Concentration",
        def: "Molarity (M) = moles solute / liters solution. Molality (m) = moles / kg solvent. Dilution: M₁V₁ = M₂V₂. Solubility rules: all nitrates soluble; most chlorides soluble (except Ag⁺, Pb²⁺, Hg₂²⁺). Like dissolves like: polar solvents dissolve polar/ionic solutes; nonpolar solvents dissolve nonpolar solutes.",
        keywords: ["molarity", "molality", "solubility", "dilution", "concentration", "dissolve"]
      },
      {
        term: "Stoichiometry",
        def: "Mole concept: 1 mol = 6.022×10²³ particles (Avogadro's number). Molar mass: sum of atomic masses in g/mol. Balanced equations give mole ratios. Limiting reagent: reactant completely consumed first; determines maximum product yield. Percent yield = (actual yield / theoretical yield) × 100%.",
        keywords: ["stoichiometry", "mole", "avogadro", "limiting reagent", "percent yield", "molar mass", "theoretical yield"]
      },
      {
        term: "Nuclear Chemistry",
        def: "Radioactive decay types: alpha (α, ²⁴He nucleus emitted, penetration lowest), beta-minus (β⁻, neutron → proton + electron), beta-plus (positron emission), gamma (γ, high-energy photon, no mass/charge change). Half-life: constant for each isotope. Fission splits heavy nuclei; fusion combines light nuclei.",
        keywords: ["radioactive", "alpha decay", "beta decay", "gamma radiation", "half-life", "nuclear decay", "isotope decay"]
      },
      {
        term: "Organic Chemistry",
        def: "Hydrocarbons: alkanes (single bonds, CₙH₂ₙ₊₂), alkenes (double bond, CₙH₂ₙ), alkynes (triple bond, CₙH₂ₙ₋₂), benzene (aromatic). Functional groups: hydroxyl (−OH, alcohols), carbonyl (C=O), carboxyl (−COOH, acids), amino (−NH₂), ester (−COO−). IUPAC naming by longest carbon chain.",
        keywords: ["organic", "alkane", "alkene", "alkyne", "functional group", "hydrocarbon", "benzene", "carboxyl", "hydroxyl"]
      },
      {
        term: "Intermolecular Forces",
        def: "London dispersion forces (van der Waals): weakest; in all molecules; increase with molecular mass and surface area. Dipole-dipole: between polar molecules. Hydrogen bonds: strongest intermolecular; N–H, O–H, or F–H with electronegative atom on adjacent molecule. IMF strength determines boiling point and vapor pressure.",
        keywords: ["intermolecular", "van der waals", "london dispersion", "dipole-dipole", "hydrogen bond", "boiling point", "polar molecule"]
      },
      {
        term: "Molecular Geometry (VSEPR)",
        def: "VSEPR theory: electron pairs repel to maximize separation. Shapes by electron pairs: 2 = linear, 3 = trigonal planar, 4 = tetrahedral, 5 = trigonal bipyramidal, 6 = octahedral. Lone pairs compress bond angles. Water (2 lone pairs): bent (~104.5°). NH₃ (1 lone pair): trigonal pyramidal (~107°).",
        keywords: ["vsepr", "molecular geometry", "bond angle", "lone pair", "tetrahedral", "trigonal", "bent", "linear geometry"]
      },
      {
        term: "Quantum Numbers",
        def: "Four quantum numbers describe each electron: n (principal, energy level, 1,2,3…), l (angular momentum, subshell: 0=s, 1=p, 2=d, 3=f), mₗ (magnetic, orbital orientation), mₛ (spin, +½ or −½). Pauli exclusion: no two electrons can share all four quantum numbers. Aufbau and Hund's rules fill orbitals.",
        keywords: ["quantum number", "principal quantum", "subshell", "orbital", "aufbau", "pauli exclusion", "hund", "electron configuration"]
      },
      {
        term: "Types of Chemical Reactions",
        def: "Synthesis (combination): A + B → AB. Decomposition: AB → A + B. Single displacement: A + BC → AC + B. Double displacement (metathesis): AB + CD → AD + CB. Combustion: fuel + O₂ → CO₂ + H₂O. Acid-base neutralization: acid + base → salt + water.",
        keywords: ["synthesis reaction", "decomposition", "single displacement", "double displacement", "combustion reaction", "neutralization reaction"]
      },
      {
        term: "Colligative Properties",
        def: "Properties that depend only on the number of solute particles, not their identity. Adding a non-volatile solute: raises boiling point (ΔTb = Kb·m·i), lowers freezing point (ΔTf = Kf·m·i), lowers vapor pressure (Raoult's Law), and increases osmotic pressure (π = MRT·i). i = van 't Hoff factor.",
        keywords: ["colligative", "boiling point elevation", "freezing point depression", "osmotic pressure", "raoult", "van hoff"]
      },
      {
        term: "Phase Diagrams",
        def: "Graph of pressure vs temperature showing solid, liquid, and gas regions. Triple point: all three phases coexist. Critical point: above this T and P, liquid and gas are indistinguishable (supercritical fluid). Sublimation: solid → gas directly (CO₂ at 1 atm). Normal boiling/melting points are at 1 atm.",
        keywords: ["phase diagram", "triple point", "critical point", "sublimation", "melting point", "boiling point", "supercritical"]
      },
      {
        term: "Buffers",
        def: "Resist changes in pH when small amounts of acid or base are added. Composed of a weak acid and its conjugate base (or weak base and its conjugate acid). Henderson-Hasselbalch equation: pH = pKa + log([A⁻]/[HA]). Most effective buffering at pH = pKa ± 1. Blood is buffered by H₂CO₃/HCO₃⁻ at pH ≈ 7.4.",
        keywords: ["buffer", "henderson-hasselbalch", "pka", "conjugate base", "weak acid", "resist ph"]
      },
      {
        term: "Oxidation States",
        def: "Assign oxidation numbers: free elements = 0; monatomic ions = charge; O usually −2 (except peroxides: −1); H usually +1 (except metal hydrides: −1); sum = charge of species. In redox reactions, the oxidizing agent is reduced (gains electrons); the reducing agent is oxidized (loses electrons).",
        keywords: ["oxidation state", "oxidation number", "oxidizing agent", "reducing agent", "redox", "assign oxidation"]
      },
      {
        term: "Coordination Compounds",
        def: "Metal ion (Lewis acid) surrounded by ligands (Lewis bases donating electron pairs). Coordination number: number of ligand bonds to metal. Ligand types: monodentate (one bond, e.g., NH₃, Cl⁻), bidentate (two bonds, e.g., en), polydentate (chelate). Complex ion charge = metal oxidation state + ligand charges.",
        keywords: ["coordination", "ligand", "complex ion", "chelate", "coordination number", "bidentate", "lewis acid base"]
      },
      {
        term: "Isomers",
        def: "Structural isomers: same molecular formula, different connectivity (e.g., butane vs isobutane). Geometric (cis-trans) isomers: same connectivity, different spatial arrangement around a double bond or ring. Optical isomers (enantiomers): non-superimposable mirror images; differ at chiral carbon; rotate plane-polarized light oppositely.",
        keywords: ["isomer", "structural isomer", "cis-trans", "geometric isomer", "enantiomer", "optical isomer", "chiral", "stereoisomer"]
      },
      {
        term: "Spectroscopy",
        def: "Emission spectra: atoms emit characteristic photons when electrons fall to lower energy levels (Bohr model). Absorption spectra: atoms absorb specific wavelengths, leaving dark lines. Beer-Lambert Law: A = εlc (absorbance = molar absorptivity × path length × concentration). NMR, IR, and mass spectrometry identify organic compounds.",
        keywords: ["spectroscopy", "emission spectrum", "absorption spectrum", "beer-lambert", "bohr", "wavelength absorbed"]
      },
      {
        term: "Polymer Chemistry",
        def: "Polymers: large molecules made of repeating monomer units. Addition polymers (e.g., polyethylene): monomers with double bonds add without losing atoms. Condensation polymers (e.g., nylon, polyester): monomers join by losing small molecules (H₂O). Proteins are natural polymers (amino acid monomers joined by peptide bonds).",
        keywords: ["polymer", "monomer", "addition polymer", "condensation polymer", "polyethylene", "nylon", "peptide bond"]
      },
      {
        term: "Reaction Mechanisms",
        def: "Elementary steps that show how reactants become products. Rate-determining step: slowest step; controls overall reaction rate. Intermediates: formed in one step, consumed in a later step. Transition state (activated complex): highest-energy point in an elementary step. SN1 and SN2 are common substitution mechanisms in organic chemistry.",
        keywords: ["mechanism", "rate-determining step", "intermediate", "transition state", "elementary step", "sn1", "sn2"]
      }
    ]
  },

  Physics: {
    color: "var(--magenta)",
    icon: "⚡",
    items: [
      {
        term: "Newton's Laws",
        def: "1st (Inertia): object stays at rest or in uniform motion without net force. 2nd: F = ma — net force equals mass × acceleration. 3rd: every action has an equal and opposite reaction. Weight W = mg (g ≈ 9.8 m/s²). Normal force is perpendicular to a surface.",
        keywords: ["newton", "inertia", "f=ma", "action reaction", "newton's law"]
      },
      {
        term: "Kinematics",
        def: "Equations (constant acceleration): v = v₀ + at; x = v₀t + ½at²; v² = v₀² + 2ax. Free fall: a = g = 9.8 m/s² downward. Projectile motion: horizontal velocity is constant; vertical component experiences g independently.",
        keywords: ["kinematics", "velocity", "displacement", "free fall", "projectile", "acceleration"]
      },
      {
        term: "Work, Energy & Power",
        def: "Work W = Fd·cosθ (Joules). Kinetic energy KE = ½mv². Gravitational PE = mgh. Work-energy theorem: net work = ΔKE. Conservation of mechanical energy (no friction): KE + PE = constant. Power P = W/t = Fv (Watts). 1 hp = 746 W.",
        keywords: ["work", "kinetic energy", "potential energy", "conservation of energy", "power", "joule", "watt"]
      },
      {
        term: "Momentum & Impulse",
        def: "Momentum p = mv (kg·m/s). Impulse J = FΔt = Δp. Conservation of momentum: total momentum conserved in closed system. Elastic collision: KE conserved. Inelastic: KE not conserved. Perfectly inelastic: objects stick together.",
        keywords: ["momentum", "impulse", "collision", "elastic", "inelastic"]
      },
      {
        term: "Waves",
        def: "Transverse: displacement perpendicular to propagation (light, EM). Longitudinal: displacement parallel (sound). Wave speed v = fλ. Amplitude: maximum displacement. Constructive interference: in phase. Destructive: out of phase. Standing waves: nodes (zero displacement) and antinodes (max displacement).",
        keywords: ["wave", "frequency", "wavelength", "amplitude", "transverse", "longitudinal", "interference", "resonance"]
      },
      {
        term: "Electromagnetic Spectrum",
        def: "Increasing frequency (decreasing λ): Radio → Microwave → Infrared → Visible (ROY G BIV) → UV → X-ray → Gamma. All travel at c = 3×10⁸ m/s in a vacuum. Photon energy E = hf. Higher frequency = more energy = more ionizing radiation.",
        keywords: ["electromagnetic", "spectrum", "infrared", "ultraviolet", "gamma ray", "x-ray", "visible light", "photon"]
      },
      {
        term: "Electric Circuits",
        def: "Ohm's Law: V = IR. Series: same current, voltages add, R_total = ΣRᵢ. Parallel: same voltage, currents add, 1/R_total = Σ(1/Rᵢ). Power P = IV = I²R = V²/R. Kirchhoff's junction rule: currents in = currents out. Loop rule: sum of voltages around a closed loop = 0.",
        keywords: ["ohm", "voltage", "current", "resistance", "circuit", "series", "parallel", "kirchhoff"]
      },
      {
        term: "Thermodynamics",
        def: "0th Law: thermal equilibrium is transitive. 1st Law: ΔU = Q − W. 2nd Law: entropy of isolated system never decreases; heat flows from hot to cold. 3rd Law: entropy → 0 as T → 0 K. Carnot efficiency (maximum): η = 1 − Tc/Th.",
        keywords: ["thermodynamics", "entropy", "carnot", "heat engine", "first law", "second law", "absolute zero"]
      },
      {
        term: "Magnetism & Induction",
        def: "Magnetic force on charge: F = qv×B. Right-hand rule for current direction and field. Faraday's Law: ε = −ΔΦ/Δt (changing flux induces EMF). Lenz's Law: induced current opposes flux change. Transformer: Vp/Vs = Np/Ns. AC generation via rotating coils in magnetic fields.",
        keywords: ["magnetic field", "faraday", "lenz", "magnetic force", "induction", "transformer", "flux", "electromagnet"]
      },
      {
        term: "Modern Physics",
        def: "Photoelectric effect (Einstein): E = hf − work function; proved light's particle nature. de Broglie: matter wavelength λ = h/p. Heisenberg uncertainty: Δx·Δp ≥ ℏ/2. Special relativity: E = mc²; time dilation t' = t/√(1−v²/c²); length contraction. Nuclear binding energy from mass defect.",
        keywords: ["photoelectric", "quantum", "de broglie", "heisenberg", "relativity", "planck", "wave-particle", "e=mc2"]
      },
      {
        term: "Circular Motion & Gravitation",
        def: "Centripetal acceleration: aₓ = v²/r (directed toward center). Centripetal force: Fc = mv²/r. Newton's Law of Universal Gravitation: F = Gm₁m₂/r². Kepler's Laws: 1st (elliptical orbits), 2nd (equal areas in equal times), 3rd (T² ∝ r³ — orbital period vs semi-major axis).",
        keywords: ["centripetal", "centrifugal", "gravitation", "orbital", "kepler", "circular motion", "universal gravitation"]
      },
      {
        term: "Simple Harmonic Motion",
        def: "Oscillation where restoring force ∝ displacement (F = −kx). Period of spring: T = 2π√(m/k). Period of pendulum: T = 2π√(L/g) — independent of amplitude (for small angles). At equilibrium: max velocity, zero PE stored. At extremes: zero velocity, max PE. Total energy E = ½kA² (constant).",
        keywords: ["simple harmonic", "oscillation", "spring constant", "pendulum", "period", "restoring force", "amplitude"]
      },
      {
        term: "Fluid Mechanics",
        def: "Pressure P = F/A; in a fluid P = ρgh. Archimedes' Principle: buoyant force = weight of displaced fluid. Pascal's Law: pressure applied to enclosed fluid transmits equally. Bernoulli's Equation: P + ½ρv² + ρgh = constant (faster flow → lower pressure). Continuity: A₁v₁ = A₂v₂.",
        keywords: ["buoyancy", "archimedes", "bernoulli", "pascal", "fluid pressure", "continuity equation", "density", "viscosity"]
      },
      {
        term: "Optics",
        def: "Law of reflection: angle of incidence = angle of reflection. Snell's Law (refraction): n₁sinθ₁ = n₂sinθ₂. Total internal reflection: when angle exceeds critical angle (n₁ > n₂). Lenses: converging (convex) focuses light; diverging (concave) spreads light. Mirror equation: 1/f = 1/dₒ + 1/dᵢ.",
        keywords: ["reflection", "refraction", "snell", "lens", "mirror", "focal length", "total internal reflection", "optic"]
      },
      {
        term: "Sound",
        def: "Longitudinal mechanical wave; requires medium. Speed in air ≈ 343 m/s (20°C). Intensity measured in decibels (dB): logarithmic scale, 10 dB increase = 10× intensity. Doppler effect: source moving toward observer → higher frequency (pitch). Standing waves in pipes/strings produce harmonics.",
        keywords: ["sound", "decibel", "doppler", "pitch", "acoustic", "longitudinal", "speed of sound", "harmonic"]
      },
      {
        term: "Electrostatics",
        def: "Coulomb's Law: F = kq₁q₂/r² (k = 9×10⁹ N·m²/C²). Electric field E = F/q = kq/r² (points away from + charges, toward − charges). Electric potential energy U = kq₁q₂/r. Electric potential V = kq/r (volts). Work done moving charge: W = qΔV. Field lines perpendicular to equipotential surfaces.",
        keywords: ["coulomb", "electric field", "electrostatics", "electric potential", "charge", "electric force"]
      },
      {
        term: "Rotational Motion",
        def: "Angular velocity ω = Δθ/Δt (rad/s). Torque τ = rF·sinθ (N·m). Moment of inertia I: resistance to angular acceleration. Newton's 2nd Law for rotation: τ = Iα. Angular momentum L = Iω; conserved when net torque = 0 (explains spinning figure skater). Rolling without slipping: v = rω.",
        keywords: ["torque", "angular momentum", "angular velocity", "moment of inertia", "rotational", "angular acceleration"]
      },
      {
        term: "Nuclear Physics",
        def: "Nucleus held together by strong nuclear force (overcomes Coulomb repulsion). Binding energy: energy released when nucleons combine (mass defect × c²). Iron-56 has highest binding energy per nucleon. Radioactive decay: alpha (A−4, Z−2), beta-minus (Z+1), beta-plus (Z−1), gamma (no change in A or Z).",
        keywords: ["nuclear force", "binding energy", "mass defect", "radioactive decay", "alpha particle", "beta particle", "nuclear physics"]
      },
      {
        term: "Capacitors",
        def: "Store electrical energy in an electric field between two conducting plates. Capacitance C = Q/V (Farads). Energy stored: U = ½CV² = Q²/2C. Parallel plate capacitor: C = ε₀A/d. Adding a dielectric increases capacitance. Series: 1/C_total = Σ(1/Cᵢ). Parallel: C_total = ΣCᵢ.",
        keywords: ["capacitor", "capacitance", "dielectric", "farad", "energy stored", "electric field capacitor"]
      },
      {
        term: "Dimensional Analysis",
        def: "Checking and converting units using known equivalences. SI base units: meter (length), kilogram (mass), second (time), ampere (current), kelvin (temperature), mole (amount), candela (luminous intensity). Derived units: Newton = kg·m/s², Joule = N·m = kg·m²/s², Pascal = N/m², Watt = J/s.",
        keywords: ["si unit", "dimensional analysis", "unit conversion", "base unit", "derived unit", "newton unit", "pascal unit"]
      },
      {
        term: "Pressure",
        def: "Force per unit area: P = F/A (Pascals). Atmospheric pressure at sea level ≈ 101,325 Pa = 1 atm = 760 mmHg = 760 torr. Gauge pressure = absolute pressure − atmospheric pressure. Vacuum gauge reads relative to atmosphere. Manometers and barometers measure pressure differences.",
        keywords: ["pressure", "pascal", "atmosphere", "atmospheric pressure", "barometer", "manometer", "gauge pressure"]
      },
      {
        term: "Doppler Effect",
        def: "Apparent change in frequency due to relative motion between source and observer. Source moving toward observer: higher observed frequency. Source moving away: lower frequency. f_obs = f_source × (v ± v_obs)/(v ∓ v_source). Applies to sound and light; redshift (galaxies moving away) is the Doppler effect for light.",
        keywords: ["doppler", "redshift", "blueshift", "frequency shift", "apparent frequency", "doppler effect"]
      },
      {
        term: "Electric Power & Energy",
        def: "Electrical power P = IV = I²R = V²/R (Watts). Energy E = Pt (Joules or kWh). Transformers change voltage for efficient long-distance transmission (high V, low I reduces resistive losses P = I²R). AC voltage is described by RMS values: V_rms = V_peak/√2.",
        keywords: ["electric power", "kilowatt hour", "rms voltage", "power dissipation", "energy consumption", "electrical energy"]
      },
      {
        term: "Light & Photons",
        def: "Light exhibits wave-particle duality. As a wave: interference, diffraction, polarization. As a particle (photon): energy E = hf = hc/λ. Photoelectric effect confirms particle nature. Double-slit experiment demonstrates wave nature. Photons carry momentum p = h/λ. Speed of light c = 3×10⁸ m/s in vacuum.",
        keywords: ["photon", "light", "double slit", "interference light", "polarization", "wave-particle duality", "hf", "hc/lambda"]
      },
      {
        term: "Special Relativity",
        def: "Einstein's postulates: laws of physics same in all inertial frames; speed of light c is constant for all observers. Consequences: time dilation (moving clocks run slow), length contraction (moving objects shorter in direction of motion), mass-energy equivalence E = mc². Nothing with mass can reach c.",
        keywords: ["special relativity", "time dilation", "length contraction", "e=mc2", "lorentz", "relativistic", "speed of light constant"]
      },
      {
        term: "Gravitational Fields",
        def: "Gravitational field strength g = GM/r² (N/kg or m/s²). Near Earth's surface, g ≈ 9.8 m/s². Gravitational potential energy: U = −GMm/r (negative, bound system). Escape velocity: v_esc = √(2GM/r). Orbital velocity: v_orb = √(GM/r). Black holes have escape velocity ≥ c.",
        keywords: ["gravitational field", "escape velocity", "orbital velocity", "gravitational potential", "gravity", "GM/r"]
      }
    ]
  },

  "Earth Science": {
    color: "var(--orange)",
    icon: "🌍",
    items: [
      {
        term: "Plate Tectonics",
        def: "Earth's lithosphere divided into plates driven by mantle convection. Convergent boundaries: subduction (oceanic under continental → volcanoes/trenches) or continent–continent collision (mountains). Divergent: plates separate (mid-ocean ridges). Transform: plates slide past (strike-slip faults, earthquakes).",
        keywords: ["plate tectonic", "subduction", "divergent", "convergent", "transform", "fault", "lithosphere"]
      },
      {
        term: "Rock Cycle",
        def: "Igneous rocks: cooled magma/lava; intrusive (slow cooling, large crystals) = granite; extrusive (fast) = basalt. Sedimentary: compacted sediments (limestone, sandstone, shale). Metamorphic: heat + pressure transform existing rock (marble from limestone; quartzite from sandstone). All types can convert to others.",
        keywords: ["igneous", "sedimentary", "metamorphic", "rock cycle", "magma", "lava", "granite", "basalt", "limestone"]
      },
      {
        term: "Atmosphere Layers",
        def: "Troposphere (0–12 km): weather; T decreases with altitude. Stratosphere (12–50 km): ozone layer; T increases. Mesosphere (50–80 km): coldest; meteors burn. Thermosphere: aurora borealis; ionosphere. Exosphere: outermost; merges with space. Tropopause/stratopause mark boundaries.",
        keywords: ["troposphere", "stratosphere", "mesosphere", "thermosphere", "ozone", "ionosphere", "aurora"]
      },
      {
        term: "Earth's Interior",
        def: "Crust: oceanic (denser basaltic) and continental (granitic). Mantle (largest): silicate rock; partially molten asthenosphere allows plate movement. Outer core: liquid iron-nickel; convection generates Earth's magnetic field via dynamo effect. Inner core: solid iron-nickel despite high temperature (extreme pressure).",
        keywords: ["crust", "mantle", "outer core", "inner core", "asthenosphere", "earth interior", "seismic"]
      },
      {
        term: "Geologic Time Scale",
        def: "Eons: Hadean, Archean, Proterozoic, Phanerozoic. Phanerozoic eras: Paleozoic (invertebrates, fish, amphibians), Mesozoic (Triassic/Jurassic/Cretaceous; dinosaurs, first mammals), Cenozoic (Paleogene/Neogene/Quaternary; mammals dominant, humans). Radiometric dating uses radioactive decay half-lives.",
        keywords: ["geologic time", "paleozoic", "mesozoic", "cenozoic", "jurassic", "cretaceous", "radiometric", "era"]
      },
      {
        term: "Water Cycle",
        def: "Evaporation + transpiration (evapotranspiration) move water into atmosphere. Condensation forms clouds. Precipitation returns water to surface. Infiltration recharges groundwater. Surface runoff flows to rivers and oceans. Solar energy drives the cycle; gravity pulls water downward.",
        keywords: ["evaporation", "condensation", "precipitation", "transpiration", "water cycle", "groundwater", "runoff"]
      },
      {
        term: "Minerals",
        def: "Naturally occurring, inorganic, crystalline solids with definite chemical composition. Identified by hardness (Mohs scale: talc=1, gypsum=2, calcite=3, fluorite=4, apatite=5, feldspar=6, quartz=7, topaz=8, corundum=9, diamond=10), luster, streak, cleavage/fracture, and specific gravity.",
        keywords: ["mineral", "mohs", "hardness", "silicate", "cleavage", "luster", "quartz", "feldspar", "streak"]
      },
      {
        term: "Earthquakes & Seismic Waves",
        def: "P-waves (primary, compressional): fastest; travel through solids and liquids. S-waves (shear): solids only; used to identify liquid outer core. Surface waves cause most structural damage. Hypocenter: underground origin. Epicenter: surface point above focus. Richter and moment magnitude scales measure size.",
        keywords: ["earthquake", "seismic", "p-wave", "s-wave", "epicenter", "richter", "magnitude", "focus"]
      },
      {
        term: "Ocean Circulation",
        def: "Surface currents driven by wind; gyres rotate clockwise in NH, counterclockwise in SH (Coriolis effect). Thermohaline circulation: deep ocean conveyor belt driven by density differences (cold, salty water sinks). Upwelling brings cold, nutrient-rich deep water to surface, supporting marine ecosystems.",
        keywords: ["ocean current", "thermohaline", "gyre", "upwelling", "salinity", "gulf stream", "coriolis"]
      },
      {
        term: "Weather Systems",
        def: "High pressure (anticyclone): sinking air, clear skies. Low pressure (cyclone): rising air, clouds and precipitation. Cold front: dense cold air pushes warm air up rapidly (thunderstorms). Warm front: warm air rises gradually over cold (steady rain). Coriolis deflects winds; jet streams steer weather systems.",
        keywords: ["weather", "front", "cyclone", "anticyclone", "air mass", "cold front", "warm front", "coriolis"]
      },
      {
        term: "Volcanoes",
        def: "Shield volcanoes: broad, gently sloping; basaltic lava flows; low viscosity (e.g., Hawaiian). Composite/stratovolcanoes: steep, explosive; andesitic/rhyolitic magma; high viscosity (e.g., Mt. St. Helens). Cinder cone: steep, pyroclastic material. Hotspot volcanism: mantle plumes not at plate boundaries.",
        keywords: ["volcano", "shield volcano", "composite volcano", "stratovolcano", "basalt", "magma", "lava flow", "eruption", "cinder cone"]
      },
      {
        term: "Glaciers & Ice Ages",
        def: "Glaciers form where snowfall exceeds melting; compressed snow becomes ice. Continental glaciers (ice sheets) covered much of North America during Pleistocene ice ages. Valley glaciers carve U-shaped valleys, cirques, horns, and fjords. Glacial till is unsorted sediment deposited by ice.",
        keywords: ["glacier", "ice age", "pleistocene", "ice sheet", "glacial", "till", "moraine", "ice core"]
      },
      {
        term: "Weathering & Erosion",
        def: "Mechanical weathering: breaks rock without changing composition (freeze-thaw, abrasion). Chemical weathering: alters minerals (oxidation, hydrolysis, carbonation — CO₂ + H₂O → carbonic acid dissolves limestone). Erosion: transport of weathered material by water, wind, ice, or gravity. Soil forms from weathered rock + organic matter.",
        keywords: ["weathering", "erosion", "mechanical weathering", "chemical weathering", "soil", "oxidation", "carbonic acid"]
      },
      {
        term: "Tides",
        def: "Caused by gravitational pull of the Moon (primary) and Sun. High tide on the side facing the Moon and on the opposite side (inertia). Spring tides (highest range): Moon, Earth, and Sun aligned (new/full moon). Neap tides (lowest range): Moon and Sun at 90° (quarter moons).",
        keywords: ["tide", "spring tide", "neap tide", "lunar", "tidal force", "high tide", "low tide"]
      },
      {
        term: "Solar System",
        def: "Inner rocky planets: Mercury, Venus, Earth, Mars. Outer gas giants: Jupiter, Saturn. Ice giants: Uranus, Neptune. Asteroid belt between Mars and Jupiter. Kuiper Belt beyond Neptune (contains Pluto). Oort Cloud: distant source of comets. Comets: icy bodies with tails pointing away from the Sun.",
        keywords: ["solar system", "planet", "asteroid belt", "kuiper belt", "oort cloud", "comet", "dwarf planet", "jupiter"]
      },
      {
        term: "Stellar Evolution",
        def: "Stars form in nebulae via gravitational collapse. Main sequence: hydrogen fusion in core. H-R diagram: luminosity vs temperature; main sequence is diagonal band. After H is exhausted: expands to red giant. Low-mass stars → white dwarf. High-mass stars → supernova → neutron star or black hole.",
        keywords: ["star", "main sequence", "red giant", "white dwarf", "neutron star", "black hole", "supernova", "h-r diagram", "stellar evolution"]
      },
      {
        term: "Galaxies & Cosmology",
        def: "Milky Way: barred spiral galaxy; Sun is ~26,000 ly from center. Galaxy types: spiral, elliptical, irregular. Hubble's Law: v = H₀d (galaxies recede proportional to distance). Big Bang: universe ≈ 13.8 billion years old; supported by cosmic microwave background radiation and element abundances.",
        keywords: ["galaxy", "milky way", "hubble", "big bang", "cosmology", "universe", "cosmic microwave background", "redshift"]
      },
      {
        term: "Fossils & Paleontology",
        def: "Fossils form when organisms are buried in sediment and minerals replace organic material. Index fossils: widespread, short time span; used for correlation and dating. Relative dating: using rock layers (stratigraphy); law of superposition: lower layers are older. Absolute dating uses radioactive isotopes (C-14, U-238).",
        keywords: ["fossil", "index fossil", "stratigraphy", "superposition", "relative dating", "carbon-14", "paleontology"]
      },
      {
        term: "Carbon Cycle",
        def: "Carbon moves between atmosphere (CO₂), biosphere (photosynthesis/respiration), hydrosphere (dissolved CO₂), and lithosphere (fossil fuels, limestone). Photosynthesis removes CO₂; respiration and combustion release it. Ocean is a major carbon sink. Human burning of fossil fuels increases atmospheric CO₂.",
        keywords: ["carbon cycle", "carbon dioxide", "photosynthesis carbon", "respiration carbon", "carbon sink", "greenhouse gas", "fossil fuel carbon"]
      },
      {
        term: "El Niño & La Niña",
        def: "El Niño (ENSO warm phase): weakening of trade winds causes warm Pacific water to spread east → increased rainfall in South America, droughts in Australia/SE Asia. La Niña (cool phase): stronger trade winds → cooler eastern Pacific. Affects global weather patterns every 2–7 years.",
        keywords: ["el nino", "la nina", "enso", "trade wind", "pacific", "climate pattern", "sea surface temperature"]
      },
      {
        term: "Cloud Formation & Precipitation",
        def: "Clouds form when moist air rises and cools to the dew point, condensing around condensation nuclei. Types: cirrus (high, wispy), stratus (low, layered, fog), cumulus (puffy, fair weather), cumulonimbus (thunderstorm). Precipitation types: rain, snow, sleet, hail. Orographic lift: mountains force air upward.",
        keywords: ["cloud", "condensation", "dew point", "cumulus", "stratus", "cumulonimbus", "precipitation type", "orographic"]
      },
      {
        term: "Groundwater",
        def: "Water stored in aquifers (permeable rock layers). Water table: upper surface of saturated zone. Recharge occurs where precipitation infiltrates permeable surface. Artesian wells: water under pressure; rises without pumping. Karst topography forms from dissolution of limestone by slightly acidic groundwater (sinkholes, caves).",
        keywords: ["groundwater", "aquifer", "water table", "artesian", "karst", "sinkhole", "infiltration"]
      },
      {
        term: "Moon Phases",
        def: "The Moon orbits Earth in ~29.5 days (synodic period). Phases depend on the angle between the Moon, Earth, and Sun. New moon → waxing crescent → first quarter → waxing gibbous → full moon → waning gibbous → third quarter → waning crescent. Lunar eclipses: Earth's shadow on Moon (full moon). Solar eclipses: Moon between Earth and Sun (new moon).",
        keywords: ["moon phase", "full moon", "new moon", "lunar eclipse", "solar eclipse", "waxing", "waning", "synodic"]
      },
      {
        term: "Earth's Magnetic Field",
        def: "Generated by convection currents in the liquid outer core (geodynamo). Magnetic poles are not aligned with geographic poles (magnetic declination). Magnetosphere deflects solar wind (charged particles); protects life from radiation. Magnetic pole reversals are recorded in oceanic crust — evidence for seafloor spreading.",
        keywords: ["magnetic field", "geodynamo", "magnetosphere", "magnetic pole", "magnetic declination", "solar wind", "seafloor spreading"]
      },
      {
        term: "Biomes & Climate Zones",
        def: "Biomes are large regions defined by climate and dominant vegetation. Tropical rainforest (high T, high rainfall), savanna (wet/dry seasons), desert (low rainfall, hot or cold), temperate forest (seasonal), taiga/boreal forest (cold, conifers), tundra (permafrost, treeless). Determined by latitude, altitude, and ocean currents.",
        keywords: ["biome", "tropical rainforest", "tundra", "desert biome", "taiga", "temperate forest", "climate zone", "permafrost"]
      },
      {
        term: "Seafloor Spreading",
        def: "New oceanic crust forms at mid-ocean ridges as magma rises and solidifies. Crust moves away from ridge, becomes older and denser, and eventually subducts at ocean trenches. Magnetic striping in oceanic crust records polarity reversals, providing key evidence. Explains why ocean floor is younger than continental crust.",
        keywords: ["seafloor spreading", "mid-ocean ridge", "oceanic crust", "magnetic striping", "subduction", "plate movement"]
      }
    ]
  },

  Energy: {
    color: "var(--orange)",
    icon: "☢️",
    items: [
      {
        term: "Conservation of Energy",
        def: "First Law of Thermodynamics: energy cannot be created or destroyed — only converted between forms. Total energy of an isolated system is constant. Forms include kinetic, gravitational potential, elastic potential, thermal, chemical, electrical, radiant, and nuclear energy.",
        keywords: ["conservation of energy", "first law", "energy conversion", "isolated system"]
      },
      {
        term: "Nuclear Fission",
        def: "Heavy nucleus (U-235, Pu-239) absorbs a neutron and splits into lighter nuclei + 2–3 neutrons + energy. Released neutrons can trigger more fissions (chain reaction). Requires critical mass. Used in nuclear reactors (controlled, moderated by water or graphite) and atomic bombs (uncontrolled).",
        keywords: ["fission", "nuclear", "uranium", "plutonium", "chain reaction", "neutron", "reactor"]
      },
      {
        term: "Nuclear Fusion",
        def: "Light nuclei (deuterium + tritium, hydrogen isotopes) combine to form helium-4 + a neutron + enormous energy. Releases ~3–4× more energy per mass than fission. Powers stars via the proton-proton chain. Requires extreme temperatures (>10⁷ K) to overcome Coulomb repulsion. Tokamak reactors pursue controlled fusion.",
        keywords: ["fusion", "deuterium", "tritium", "tokamak", "plasma", "thermonuclear", "proton-proton"]
      },
      {
        term: "Fossil Fuels",
        def: "Coal (compressed ancient plants, highest carbon content, most CO₂/energy), petroleum (marine organisms; refined to gasoline, diesel, jet fuel), natural gas (mainly CH₄, cleanest-burning). All release CO₂ and other pollutants on combustion, driving the enhanced greenhouse effect. Non-renewable on human timescales.",
        keywords: ["fossil fuel", "coal", "petroleum", "natural gas", "methane", "combustion", "carbon dioxide", "greenhouse"]
      },
      {
        term: "Photovoltaic Effect",
        def: "Photons strike a silicon p-n junction semiconductor, exciting electrons across the band gap and producing direct current (DC). Inverters convert DC to AC. Typical panel efficiency: 15–22%. The photoelectric effect (Einstein, 1905) is the quantum basis. Output scales with light intensity and angle.",
        keywords: ["photovoltaic", "solar cell", "solar panel", "semiconductor", "silicon", "pv cell", "direct current"]
      },
      {
        term: "Wind Energy",
        def: "Wind turbines convert kinetic energy of wind to rotational energy via blades, then to electricity via generator. Betz limit: maximum theoretical efficiency = 59.3% (can never capture all wind energy). Offshore wind is stronger and more consistent. Power output scales with the cube of wind speed (P ∝ v³).",
        keywords: ["wind turbine", "wind energy", "betz", "wind power", "generator", "rotor blade"]
      },
      {
        term: "Thermodynamic Efficiency",
        def: "No heat engine can be 100% efficient (2nd Law). Carnot efficiency (maximum theoretical): η = 1 − Tc/Th (temperatures in Kelvin). Real engines are always less than Carnot. COP (coefficient of performance) for refrigerators: COP = Qc/W. For heat pumps: COP = Qh/W.",
        keywords: ["carnot", "efficiency", "heat engine", "cop", "thermal efficiency", "second law"]
      },
      {
        term: "Hydropower",
        def: "Converts gravitational PE of water to electricity via turbines and generators. Power P = ρghQ. Pumped-storage: pump water uphill when energy is cheap; release to generate on demand — acts as a grid-scale battery. Run-of-river vs reservoir (dam) types. Largest renewable electricity source globally.",
        keywords: ["hydropower", "dam", "turbine", "water power", "pumped storage", "hydroelectric", "potential energy"]
      },
      {
        term: "Second Law of Thermodynamics",
        def: "Entropy of an isolated system always increases (or stays the same). Heat flows spontaneously from hot to cold. No process is 100% efficient — some energy is always lost as waste heat. Clausius statement: heat cannot spontaneously flow from cold to hot. Arrow of time is defined by entropy increase.",
        keywords: ["second law", "entropy increase", "heat flow", "irreversible", "clausius", "disorder"]
      },
      {
        term: "Heat Transfer",
        def: "Conduction: heat transfer through direct contact; rate depends on thermal conductivity, area, temperature difference, and thickness (Fourier's Law). Convection: heat carried by fluid movement; drives ocean circulation and weather. Radiation: electromagnetic waves (infrared); requires no medium; described by Stefan-Boltzmann Law (P = σεAT⁴).",
        keywords: ["conduction", "convection", "radiation heat", "thermal conductivity", "heat transfer", "infrared radiation", "stefan boltzmann"]
      },
      {
        term: "Geothermal Energy",
        def: "Heat from Earth's interior (radioactive decay + residual heat from formation). Used directly for heating or to generate electricity (steam drives turbines). Geothermal power plants require high-temperature geothermal reservoirs (e.g., Iceland, Kenya, Geysers in California). Baseload renewable — consistent output unlike solar/wind.",
        keywords: ["geothermal", "earth heat", "geothermal energy", "geothermal power", "radioactive decay heat", "baseload"]
      },
      {
        term: "Tidal Energy",
        def: "Harnesses energy from tidal changes in sea level. Tidal barrages: dam-like structures capture potential energy of tidal range. Tidal stream generators: underwater turbines in tidal currents (like underwater wind turbines). Predictable unlike solar/wind. Limited to coastal regions with large tidal ranges (e.g., Bay of Fundy).",
        keywords: ["tidal energy", "tidal barrage", "tidal stream", "tide energy", "tidal power", "bay of fundy"]
      },
      {
        term: "Biomass & Biofuels",
        def: "Biomass: organic material (wood, crop waste, animal waste) burned directly or converted to biogas/biofuels. Ethanol: fermented from sugars/starches (corn, sugarcane). Biodiesel: made from vegetable oils/animal fats via transesterification. Biogas (mostly CH₄) from anaerobic digestion. Carbon-neutral if sustainably sourced.",
        keywords: ["biomass", "biofuel", "ethanol", "biodiesel", "biogas", "fermentation", "anaerobic digestion"]
      },
      {
        term: "Hydrogen Fuel Cells",
        def: "Electrochemical device that converts H₂ and O₂ directly to electricity + water (2H₂ + O₂ → 2H₂O + electricity). Anode: H₂ oxidized, releases electrons. Cathode: O₂ reduced with electrons + H⁺. Efficiency ~40–60%, higher than combustion. Zero emissions at point of use. Hydrogen must be produced (electrolysis or steam reforming).",
        keywords: ["fuel cell", "hydrogen", "electrochemical", "electrolysis", "proton exchange membrane", "clean energy"]
      },
      {
        term: "Energy Storage & Batteries",
        def: "Lithium-ion batteries: Li⁺ ions move between anode (graphite) and cathode (LiCoO₂) through electrolyte. High energy density. Pumped hydro: largest grid storage. Flow batteries: electrolyte stored in tanks (scalable). Supercapacitors: fast charge/discharge, lower energy density. Storage critical for intermittent renewables.",
        keywords: ["battery", "lithium ion", "energy storage", "pumped hydro", "supercapacitor", "grid storage", "rechargeable"]
      },
      {
        term: "Greenhouse Effect",
        def: "Solar radiation (shortwave) passes through atmosphere and warms Earth's surface. Earth re-radiates longwave infrared radiation, which is absorbed and re-emitted by greenhouse gases (CO₂, CH₄, H₂O, N₂O, ozone). Enhanced greenhouse effect: human-emitted CO₂ from fossil fuels increases warming above natural levels.",
        keywords: ["greenhouse effect", "greenhouse gas", "co2", "global warming", "infrared", "climate change", "carbon dioxide"]
      },
      {
        term: "Carbon Capture & Sequestration",
        def: "CCS captures CO₂ from power plants or atmosphere and stores it underground in geological formations, depleted oil/gas fields, or mineralizes it. Direct air capture (DAC): pulls CO₂ directly from ambient air. Bioenergy with CCS (BECCS) could achieve negative emissions. High cost limits widespread deployment.",
        keywords: ["carbon capture", "ccs", "sequestration", "direct air capture", "dac", "negative emissions", "co2 storage"]
      },
      {
        term: "Radioactive Decay",
        def: "Unstable nuclei emit particles/energy spontaneously. Alpha (α): emits ²He nucleus (A−4, Z−2); stopped by paper. Beta-minus (β⁻): neutron → proton + electron; stopped by metal foil. Gamma (γ): high-energy photon; requires lead shielding. Half-life (t½): time for half the nuclei to decay; used in radiometric dating.",
        keywords: ["radioactive decay", "alpha decay", "beta decay", "gamma radiation", "half-life decay", "decay constant"]
      },
      {
        term: "Energy Units & Conversions",
        def: "Joule (J): SI unit of energy. 1 calorie = 4.184 J. 1 kWh = 3.6×10⁶ J. 1 BTU ≈ 1055 J. 1 eV = 1.6×10⁻¹⁹ J. Power: 1 Watt = 1 J/s; 1 horsepower = 746 W. Energy content of fuels measured in MJ/kg (hydrogen: 142 MJ/kg; gasoline: 46 MJ/kg; coal: ~30 MJ/kg).",
        keywords: ["joule", "kilowatt hour", "btu", "energy unit", "calorie", "electron volt", "energy conversion unit"]
      },
      {
        term: "Power Transmission & Grid",
        def: "Power is transmitted at high voltage to minimize resistive losses (P_loss = I²R; high V → low I for same power). Step-up transformers increase voltage for transmission; step-down at substations reduce for consumers. AC (alternating current) used because transformers only work with AC. DC transmission used for some long-distance high-voltage links.",
        keywords: ["power grid", "transformer", "transmission", "ac current", "dc current", "high voltage", "power loss", "substation"]
      },
      {
        term: "Nuclear Waste",
        def: "High-level waste (HLW): spent nuclear fuel; highly radioactive, requires deep geological disposal (stable for 10,000+ years). Low-level waste: contaminated tools/clothing. Spent fuel rods cooled in water pools first, then dry cask storage. Reprocessing extracts remaining fissile material (France, Russia) but creates proliferation concerns.",
        keywords: ["nuclear waste", "spent fuel", "high-level waste", "radioactive waste", "dry cask", "geological disposal"]
      },
      {
        term: "Energy Efficiency",
        def: "Efficiency = useful energy output / total energy input × 100%. LED bulbs: ~90% efficient (vs ~5% for incandescent). Electric vehicles: ~77% tank-to-wheel vs ~20% for gasoline. Insulation reduces conduction heat losses in buildings. ENERGY STAR ratings. Cogeneration (CHP): captures waste heat for useful heating.",
        keywords: ["energy efficiency", "led", "insulation", "cogeneration", "heat pump efficiency", "energy star", "waste heat"]
      },
      {
        term: "Entropy",
        def: "Measure of disorder or randomness in a system (S, units: J/K). 2nd Law: ΔS_universe ≥ 0 for any process. Entropy increases when: ice melts, gas expands, heat flows from hot to cold. Mixing increases entropy. Boltzmann's definition: S = k·ln(W) where W is the number of microstates. Low entropy states are less probable.",
        keywords: ["entropy", "disorder", "boltzmann", "microstates", "second law entropy", "entropy increase", "thermodynamic entropy"]
      },
      {
        term: "Renewable vs Non-Renewable",
        def: "Renewables replenish on human timescales: solar, wind, hydro, geothermal, tidal, biomass. Non-renewables: fossil fuels (coal, oil, gas) and nuclear (uranium is finite). Renewables have near-zero marginal fuel cost but high capital cost. Wind and solar have intermittency challenges requiring storage or backup. Global energy still ~80% from fossil fuels.",
        keywords: ["renewable energy", "non-renewable", "solar wind hydro", "energy source", "sustainable energy", "fossil fuel vs renewable"]
      },
      {
        term: "Ocean Thermal Energy Conversion",
        def: "OTEC exploits temperature differences between warm surface water (~25°C) and cold deep water (~5°C) to run a heat engine. Low Carnot efficiency (~3–5%) but uses a continuous, renewable resource. Three types: closed-cycle (ammonia as working fluid), open-cycle (flash steam), hybrid. Best near tropical coastlines.",
        keywords: ["otec", "ocean thermal", "ocean energy", "temperature difference", "heat engine ocean", "tropical energy"]
      }
    ]
  },

  Math: {
    color: "var(--cyan)",
    icon: "∑",
    items: [
      {
        term: "Quadratic Equations",
        def: "Form ax² + bx + c = 0. Quadratic formula: x = (−b ± √(b²−4ac)) / 2a. Discriminant Δ = b²−4ac: Δ > 0 → two real roots; Δ = 0 → one real root; Δ < 0 → two complex roots. Vertex at x = −b/2a. Sum of roots = −b/a; product of roots = c/a.",
        keywords: ["quadratic", "discriminant", "quadratic formula", "parabola", "vertex", "roots of"]
      },
      {
        term: "Logarithms",
        def: "log_b(x) = y ↔ bʸ = x. ln(x) = log_e(x). Rules: log(ab) = log a + log b; log(a/b) = log a − log b; log(aⁿ) = n·log a; log_b(1) = 0; log_b(b) = 1. Change of base: log_b(x) = ln(x)/ln(b). Inverse of exponential: b^(log_b(x)) = x.",
        keywords: ["logarithm", "log", "natural log", "ln", "log rule", "change of base"]
      },
      {
        term: "Trigonometry",
        def: "SOH-CAH-TOA: sin = opp/hyp, cos = adj/hyp, tan = opp/adj. Pythagorean identity: sin²θ + cos²θ = 1. Other identities: 1 + tan²θ = sec²θ; 1 + cot²θ = csc²θ. Law of Sines: a/sinA = b/sinB. Law of Cosines: c² = a² + b² − 2ab·cosC. Radians: 180° = π rad.",
        keywords: ["trigonometry", "sine", "cosine", "tangent", "unit circle", "radian", "pythagorean identity", "law of sines"]
      },
      {
        term: "Derivatives",
        def: "Instantaneous rate of change. Power rule: d/dx[xⁿ] = nxⁿ⁻¹. Product: (uv)' = u'v + uv'. Quotient: (u/v)' = (u'v − uv')/v². Chain rule: d/dx[f(g(x))] = f'(g(x))·g'(x). d/dx[sin x] = cos x; d/dx[eˣ] = eˣ; d/dx[ln x] = 1/x. Critical points where f'(x) = 0 or undefined.",
        keywords: ["derivative", "differentiation", "power rule", "chain rule", "product rule", "calculus", "slope", "critical point"]
      },
      {
        term: "Integrals",
        def: "Antiderivative / area under curve. Power rule: ∫xⁿdx = xⁿ⁺¹/(n+1) + C (n ≠ −1). Fundamental Theorem: ∫[a,b] f(x)dx = F(b) − F(a). Key: ∫eˣdx = eˣ + C; ∫(1/x)dx = ln|x| + C; ∫cos x dx = sin x + C; ∫sin x dx = −cos x + C. Integration by substitution and by parts.",
        keywords: ["integral", "antiderivative", "integration", "fundamental theorem", "definite integral", "area under"]
      },
      {
        term: "Probability & Combinations",
        def: "P(A) = favorable / total. P(A and B) = P(A)·P(B) for independent events. P(A or B) = P(A) + P(B) − P(A∩B). Combinations C(n,r) = n!/[r!(n−r)!] — order doesn't matter. Permutations P(n,r) = n!/(n−r)! — order matters. Conditional: P(A|B) = P(A∩B)/P(B).",
        keywords: ["probability", "combination", "permutation", "factorial", "conditional probability", "binomial"]
      },
      {
        term: "Sequences & Series",
        def: "Arithmetic: aₙ = a₁ + (n−1)d; sum Sₙ = n(a₁+aₙ)/2. Geometric: aₙ = a₁·rⁿ⁻¹; sum Sₙ = a₁(1−rⁿ)/(1−r). Infinite geometric series: S = a₁/(1−r) if |r| < 1. Fibonacci: aₙ = aₙ₋₁ + aₙ₋₂ (1,1,2,3,5,8,13,…). Telescoping series: most terms cancel.",
        keywords: ["sequence", "series", "arithmetic", "geometric", "fibonacci", "convergent", "common ratio"]
      },
      {
        term: "Complex Numbers",
        def: "i = √(−1); i² = −1; i³ = −i; i⁴ = 1. Form z = a + bi. Addition: add real and imaginary parts. Multiplication: FOIL (use i² = −1). Modulus |z| = √(a²+b²). Conjugate: z̄ = a − bi; z·z̄ = |z|². Euler: e^(iθ) = cosθ + i sinθ. Division: multiply by conjugate over conjugate.",
        keywords: ["complex number", "imaginary", "modulus", "conjugate", "euler", "i^2", "polar form"]
      },
      {
        term: "Statistics",
        def: "Mean μ = Σx/n. Median: middle value. Mode: most frequent. Variance σ² = Σ(x−μ)²/n. Standard deviation σ = √(variance). Normal distribution: 68–95–99.7 rule (1σ, 2σ, 3σ). Correlation r ∈ [−1, +1]. Linear regression: line of best fit. Outliers can skew mean but not median.",
        keywords: ["mean", "median", "mode", "standard deviation", "variance", "normal distribution", "correlation", "regression"]
      },
      {
        term: "Matrices",
        def: "Rectangular arrays of numbers. Matrix multiplication: rows × columns (NOT commutative). det of 2×2 [a b; c d] = ad − bc. Inverse A⁻¹ exists iff det ≠ 0. Identity matrix I: A·I = A. Solve systems via Gaussian elimination or Cramer's Rule. Eigenvalue λ: Av = λv (eigenvector v).",
        keywords: ["matrix", "determinant", "inverse", "eigenvalue", "gaussian elimination", "cramer", "transpose"]
      },
      {
        term: "Vectors",
        def: "Quantities with magnitude and direction. Component form: v = ⟨a, b, c⟩. Magnitude |v| = √(a²+b²+c²). Dot product: u·v = |u||v|cosθ = Σuᵢvᵢ (scalar; zero if perpendicular). Cross product: u×v is perpendicular to both; |u×v| = |u||v|sinθ. Unit vector: v/|v|.",
        keywords: ["vector", "dot product", "cross product", "magnitude", "unit vector", "component", "perpendicular vector"]
      },
      {
        term: "Limits & Continuity",
        def: "lim_{x→a} f(x) = L if f(x) approaches L as x → a (from both sides). L'Hôpital's Rule: for 0/0 or ∞/∞ indeterminate forms, lim f/g = lim f'/g'. Continuity at a: f(a) defined, limit exists, and lim_{x→a} f(x) = f(a). Squeeze theorem: if g(x) ≤ f(x) ≤ h(x) and g,h → L, then f → L.",
        keywords: ["limit", "continuity", "l'hopital", "indeterminate form", "squeeze theorem", "one-sided limit"]
      },
      {
        term: "Number Theory",
        def: "Prime numbers have exactly two factors: 1 and themselves. Fundamental Theorem of Arithmetic: every integer > 1 has a unique prime factorization. GCD: greatest common divisor; LCM: least common multiple; GCD × LCM = product of two numbers. Modular arithmetic: a ≡ b (mod n) means n divides (a−b). Euler's totient function φ(n).",
        keywords: ["prime", "factor", "gcd", "lcm", "modular arithmetic", "number theory", "prime factorization", "divisibility"]
      },
      {
        term: "Conic Sections",
        def: "Circle: (x−h)² + (y−k)² = r². Ellipse: x²/a² + y²/b² = 1 (a > b; foci at ±c where c² = a²−b²). Parabola: y = ax² + bx + c; focus/directrix definition. Hyperbola: x²/a² − y²/b² = 1; asymptotes y = ±(b/a)x. All are cross-sections of a double cone.",
        keywords: ["conic section", "ellipse", "parabola", "hyperbola", "circle equation", "focus", "directrix"]
      },
      {
        term: "Polynomial Division",
        def: "Long division of polynomials mirrors long division of integers. Synthetic division: shortcut when dividing by (x − c). Remainder Theorem: dividing f(x) by (x − c) gives remainder f(c). Factor Theorem: (x − c) is a factor of f(x) iff f(c) = 0. Rational Root Theorem: rational roots of aₙxⁿ + … + a₀ are ±(factors of a₀)/(factors of aₙ).",
        keywords: ["polynomial", "synthetic division", "remainder theorem", "factor theorem", "rational root", "polynomial division"]
      },
      {
        term: "Functions & Transformations",
        def: "Domain: set of valid inputs. Range: set of outputs. Composition: (f∘g)(x) = f(g(x)). Inverse: f⁻¹ exists if f is one-to-one (passes horizontal line test); f(f⁻¹(x)) = x. Transformations: f(x) + k (vertical shift), f(x + h) (horizontal shift), af(x) (vertical stretch), f(bx) (horizontal compression).",
        keywords: ["function", "domain", "range", "composition", "inverse function", "transformation", "horizontal shift", "vertical shift"]
      },
      {
        term: "Binomial Theorem",
        def: "(a + b)ⁿ = Σ C(n,k) aⁿ⁻ᵏ bᵏ for k = 0 to n. The kth term (starting from 1) = C(n,k−1)·aⁿ⁻⁽ᵏ⁻¹⁾·bᵏ⁻¹. Pascal's triangle rows give the coefficients. C(n,k) = n!/[k!(n−k)!]. Used in probability distributions (binomial distribution) and approximations.",
        keywords: ["binomial theorem", "pascal triangle", "binomial expansion", "binomial coefficient", "combination binomial"]
      },
      {
        term: "Set Theory",
        def: "Set: unordered collection of distinct elements. Union A ∪ B: elements in A or B. Intersection A ∩ B: elements in both. Complement Aᶜ: elements not in A. Empty set ∅. Subset: A ⊆ B if every element of A is in B. |A ∪ B| = |A| + |B| − |A ∩ B| (inclusion-exclusion). Venn diagrams visualize set relationships.",
        keywords: ["set theory", "union", "intersection", "complement", "subset", "empty set", "venn diagram", "inclusion exclusion"]
      },
      {
        term: "Linear Programming",
        def: "Optimize a linear objective function subject to linear inequality constraints. Feasible region: all points satisfying all constraints (convex polygon). Optimal solution always occurs at a vertex (corner point) of the feasible region. Used in operations research, resource allocation, and supply chain optimization.",
        keywords: ["linear programming", "objective function", "constraint", "feasible region", "corner point", "optimization", "simplex"]
      },
      {
        term: "Differential Equations",
        def: "Equations involving a function and its derivatives. Separable ODEs: dy/dx = f(x)g(y) → separate and integrate. Exponential growth/decay: dy/dt = ky → y = y₀eᵏᵗ. Second-order linear ODEs model springs (y'' + ky = 0 → y = A cos√k·t + B sin√k·t). Initial conditions determine particular solutions.",
        keywords: ["differential equation", "ode", "separable", "exponential growth", "initial condition", "first order differential"]
      },
      {
        term: "Polar Coordinates",
        def: "Points described by (r, θ): r = distance from origin, θ = angle from positive x-axis. Conversion: x = r cosθ, y = r sinθ; r = √(x²+y²), θ = arctan(y/x). Circle r = a. Rose curves: r = a cos(nθ). Cardioid: r = a(1 + cosθ). Area in polar: A = ½∫r²dθ.",
        keywords: ["polar coordinates", "polar equation", "r theta", "cardioid", "rose curve", "polar area"]
      },
      {
        term: "Rational Functions",
        def: "f(x) = p(x)/q(x) where p, q are polynomials. Vertical asymptote where q(x) = 0 (and p(x) ≠ 0). Horizontal asymptote: if deg(p) < deg(q) → y = 0; deg(p) = deg(q) → y = ratio of leading coefficients; deg(p) > deg(q) → oblique asymptote. Holes where both p and q have a common factor.",
        keywords: ["rational function", "asymptote", "vertical asymptote", "horizontal asymptote", "hole", "partial fraction"]
      },
      {
        term: "Absolute Value & Inequalities",
        def: "|x| = x if x ≥ 0; −x if x < 0. |x| < a means −a < x < a. |x| > a means x > a or x < −a. Triangle inequality: |a + b| ≤ |a| + |b|. Solving quadratic inequalities: factor, find roots, test intervals. Sign chart method: track sign changes at roots and asymptotes.",
        keywords: ["absolute value", "inequality", "triangle inequality", "quadratic inequality", "sign chart", "interval notation"]
      },
      {
        term: "Parametric Equations",
        def: "Curve defined by x = f(t) and y = g(t) where t is a parameter. Eliminate the parameter to get Cartesian form. Derivative: dy/dx = (dy/dt)/(dx/dt). Arc length: L = ∫√[(dx/dt)²+(dy/dt)²] dt. Circle: x = r cosθ, y = r sinθ. Projectile: x = v₀cosθ·t, y = v₀sinθ·t − ½gt².",
        keywords: ["parametric", "parameter", "parametric equation", "eliminate parameter", "arc length parametric"]
      },
      {
        term: "Graph Theory",
        def: "Graphs consist of vertices (nodes) and edges. Degree of vertex: number of edges connected. Euler path: visits every edge exactly once (exists if exactly 0 or 2 odd-degree vertices). Euler circuit: Euler path starting and ending at same vertex (0 odd-degree vertices). Trees: connected graphs with no cycles; n vertices, n−1 edges.",
        keywords: ["graph theory", "vertex", "edge", "euler path", "degree", "tree graph", "adjacency matrix", "directed graph"]
      }
    ]
  }
};