/* Content for "Carbon and its Compounds" (NCERT Class 10 Science, Chapter 4).
   Source of truth: content/chapter_extract.md (NCERT rationalised edition, Reprint 2026-27).
   explain / keyPoints / quiz text is injected as HTML by js/app.js. */

window.CHAPTER = {
  title: "Carbon and its Compounds",
  subtitle: "One tiny atom, millions of amazing things!",
  intro: `<p>Your food, your clothes, the LPG in your kitchen and even you are made of carbon compounds. In this chapter you will see how carbon makes bonds, builds chains and rings, and takes part in reactions we use every day. Read a little, play a little, and check yourself!</p>`
};

window.CONCEPTS = [
  // 1 ------------------------------------------------------------------
  {
    id: "carbon-everywhere",
    title: "Carbon is Everywhere",
    emoji: "🌍",
    tagline: "Food, clothes, fuel and you: all built on carbon.",
    explain: `
<p>Think about your morning. You brushed your teeth, ate breakfast, wore clothes and opened a book. Most of these things are made of <b>carbon compounds</b>. A compound is a substance made of two or more elements joined together.</p>
<p>Food, clothes, medicines and books are all based on carbon. <b>All living things are carbon based</b> too, including you!</p>
<p>Surprise: carbon is actually rare in nature.</p>
<ul>
  <li>The earth's crust has only <b>0.02% carbon</b> (in carbonates, hydrogencarbonates, coal and petroleum).</li>
  <li>The air has only <b>0.03% carbon dioxide</b>.</li>
</ul>
<p>Even so, carbon is hugely important.</p>
<p><b>How are carbon compounds different from ionic compounds?</b></p>
<ul>
  <li>They are <b>poor conductors of electricity</b>. This means they do not make ions (charged particles).</li>
  <li>They have <b>low melting and boiling points</b>. This means the pull <i>between</i> their molecules is weak.</li>
</ul>
<table>
  <tr><th>Compound</th><th>Melting point (K)</th><th>Boiling point (K)</th></tr>
  <tr><td>Acetic acid (CH<sub>3</sub>COOH)</td><td>290</td><td>391</td></tr>
  <tr><td>Chloroform (CHCl<sub>3</sub>)</td><td>209</td><td>334</td></tr>
  <tr><td>Ethanol (CH<sub>3</sub>CH<sub>2</sub>OH)</td><td>156</td><td>351</td></tr>
  <tr><td>Methane (CH<sub>4</sub>)</td><td>90</td><td>111</td></tr>
</table>
<p>Compare this with common salt (an ionic compound). It melts at over 1000 K!</p>
<div class="analogy">🧲 <b>Analogy:</b> Ionic compounds are like a class holding hands tightly in a big circle. Carbon compounds are like small groups of best friends. Inside each group the grip is strong, but the groups hardly hold on to each other. So it is easy to pull the groups apart (low melting point).</div>
`,
    keyPoints: [
      "All living things are carbon based.",
      "Earth's crust has only 0.02% carbon; air has 0.03% CO<sub>2</sub>.",
      "Carbon compounds are poor conductors because they do not form ions.",
      "They have low melting and boiling points because forces between molecules are weak."
    ],
    playHint: "In <b>Find the carbon</b>, tap everyday objects to see which contain carbon; then switch to <b>Conductivity test</b> and pour liquids into the beaker to see which make the bulb glow.",
    textbookRef: "Chapter opening · Section 4.1 (Table 4.1)",
    quiz: [
      {
        q: "Why do most carbon compounds NOT conduct electricity?",
        options: ["They are always solids", "They contain metal atoms", "Their bonding does not make ions", "They have very high melting points"],
        answer: 2,
        why: "Electricity needs charged particles that can move. Carbon compounds share electrons, so no ions are formed."
      },
      {
        q: "Methane melts at 90 K and boils at 111 K. What does this tell us?",
        options: ["The forces between methane molecules are weak", "Methane is an ionic compound", "Methane conducts electricity well", "Methane has no bonds at all"],
        answer: 0,
        why: "Low melting and boiling points mean the molecules are held to each other only weakly, so little heat is needed to separate them."
      }
    ]
  },

  // 2 ------------------------------------------------------------------
  {
    id: "covalent-bond",
    title: "Sharing is Caring: The Covalent Bond",
    emoji: "🤝",
    tagline: "Carbon doesn't give or take electrons. It shares them.",
    explain: `
<p>The gas in a CNG bus is mostly <b>methane, CH<sub>4</sub></b>. How do one carbon and four hydrogens stay stuck together? The answer is <b>sharing</b>.</p>
<p><b>The problem.</b> Carbon has atomic number 6, so its shells are 2, 4. It has <b>4 valence electrons</b> (electrons in the outer shell). To become stable like a noble gas, it needs a full outer shell. It has two choices, and both are hard:</p>
<ul>
  <li><b>Gain 4 electrons</b> to make C<sup>4–</sup>. But 6 protons cannot easily hold 10 electrons.</li>
  <li><b>Lose 4 electrons</b> to make C<sup>4+</sup>. This needs a lot of energy.</li>
</ul>
<p><b>The solution.</b> Carbon <b>shares</b> its electrons with other atoms. Shared electrons count for both atoms, so both get a full outer shell.</p>
<p>A <b>covalent bond</b> is a bond formed by <b>sharing a pair of electrons between two atoms</b>.</p>
<p><b>Electron-dot structures</b> (we show only outer electrons as dots or crosses):</p>
<ul>
  <li><b>H<sub>2</sub></b>: each H gives 1 electron. One shared pair = <b>single bond</b>, H–H.</li>
  <li><b>O<sub>2</sub></b>: each O has 6 outer electrons and needs 2. They share 2 pairs = <b>double bond</b>, O=O.</li>
  <li><b>N<sub>2</sub></b>: each N has 5 outer electrons and needs 3. They share 3 pairs = <b>triple bond</b>, N≡N.</li>
  <li><b>CH<sub>4</sub></b>: carbon shares its 4 electrons with 4 H atoms. Four single bonds. Carbon is <b>tetravalent</b> (valency 4).</li>
</ul>
<p>Bonds inside the molecule are strong. Forces between molecules are weak. That is why covalent compounds have low melting points and do not conduct electricity.</p>
<div class="analogy">🍫 <b>Analogy:</b> Two friends each have half the money for a chocolate. Neither can buy it alone. They put their money together and share the chocolate. Atoms do the same with electrons!</div>
`,
    keyPoints: [
      "Carbon has 4 valence electrons (2, 4); forming C<sup>4+</sup> or C<sup>4–</sup> is very hard.",
      "Covalent bond = sharing of an electron pair between two atoms.",
      "H<sub>2</sub> has a single bond, O<sub>2</sub> a double bond, N<sub>2</sub> a triple bond.",
      "CH<sub>4</sub> has 4 single C–H bonds; methane is a major part of bio-gas and CNG."
    ],
    playHint: "Pick a molecule (H<sub>2</sub>, Cl<sub>2</sub>, O<sub>2</sub>, N<sub>2</sub>, CH<sub>4</sub> or H<sub>2</sub>O) and drag or tap the atoms together until their outer shells overlap and share electrons; also try the energy options to see why carbon cannot easily gain or lose 4 electrons.",
    textbookRef: "Section 4.1",
    quiz: [
      {
        q: "Why does carbon not form a C<sup>4+</sup> ion easily?",
        options: ["It has no electrons to lose", "Losing 4 electrons needs a lot of energy", "Carbon is a metal", "It already has 8 outer electrons"],
        answer: 1,
        why: "Removing four electrons takes a huge amount of energy, so carbon prefers to share its electrons instead."
      },
      {
        q: "How many electron pairs are shared in a nitrogen molecule, N<sub>2</sub>?",
        options: ["One", "Two", "Four", "Three"],
        answer: 3,
        why: "Each N needs 3 more electrons, so the two atoms share 3 pairs. That is a triple bond, N≡N."
      }
    ]
  },

  // 3 ------------------------------------------------------------------
  {
    id: "allotropes",
    title: "Diamond, Graphite and Footballs",
    emoji: "💎",
    tagline: "Same carbon atoms, totally different stuff.",
    explain: `
<p>A sparkling diamond ring and the grey "lead" in your pencil are made of the <b>same element</b>: pure carbon! How?</p>
<p>Different forms of the same element are called <b>allotropes</b>. In carbon's allotropes, the atoms are the same. Only the way they are <b>joined</b> is different.</p>
<p><b>1. Diamond</b></p>
<ul>
  <li>Each carbon is bonded to <b>4 other carbon atoms</b>.</li>
  <li>This makes a <b>rigid three-dimensional</b> (3D) structure.</li>
  <li>It is the <b>hardest substance known</b>.</li>
</ul>
<p><b>2. Graphite</b></p>
<ul>
  <li>Each carbon is bonded to <b>3 other carbon atoms</b> in a flat sheet.</li>
  <li>The sheets are made of hexagons (6-sided shapes). One of the three bonds is a double bond.</li>
  <li>The sheets are <b>stacked in layers</b>, which slide easily. So graphite is <b>smooth and slippery</b>.</li>
  <li>It is a <b>very good conductor of electricity</b>, unlike most non-metals.</li>
</ul>
<p><b>3. Fullerenes</b></p>
<ul>
  <li>The first one found was <b>C-60</b>: 60 carbon atoms shaped like a <b>football</b>.</li>
  <li>It is named after the architect <b>Buckminster Fuller</b>, whose dome looked similar.</li>
</ul>
<p>Diamond and graphite have very different <b>physical</b> properties, but the <b>same chemical</b> properties. For example, both burn in oxygen to give CO<sub>2</sub>.</p>
<p>Scientists can make <b>synthetic diamonds</b> by putting pure carbon under very high pressure and temperature. They are small but just like real ones.</p>
<div class="analogy">🧱 <b>Analogy:</b> Think of the same LEGO bricks. Lock them tightly in every direction and you get a hard block (diamond). Build flat sheets and stack them loosely and you get layers that slide (graphite). Snap them into a ball and you get a football (C-60).</div>
`,
    keyPoints: [
      "Allotropes: different forms of the same element with different physical properties.",
      "Diamond: each C bonded to 4 others, rigid 3D, hardest substance.",
      "Graphite: each C bonded to 3 others in hexagonal layers; slippery and a good conductor.",
      "Fullerene C-60 is football-shaped, named after Buckminster Fuller."
    ],
    playHint: "Switch between diamond, graphite and C-60 and drag the 3-D model to spin it. On graphite, press the button to slide the top layer.",
    textbookRef: "Section 4.1 · More to Know (Extra)",
    quiz: [
      {
        q: "Why is graphite used as pencil lead and as a lubricant?",
        options: ["Its layers slide over each other easily", "Each carbon is bonded to 4 others", "It is the hardest substance", "It is not made of carbon"],
        answer: 0,
        why: "Graphite has flat layers stacked loosely. They slide easily, so graphite feels smooth and slippery."
      },
      {
        q: "What is the same in diamond and graphite?",
        options: ["Hardness", "Electrical conductivity", "Chemical properties", "How the atoms are arranged"],
        answer: 2,
        why: "Both are pure carbon, so they react the same way (for example, both burn to give CO<sub>2</sub>). Their physical properties differ."
      }
    ]
  },

  // 4 ------------------------------------------------------------------
  {
    id: "versatile-carbon",
    title: "Super Carbon: Catenation and Tetravalency",
    emoji: "🔗",
    tagline: "Two superpowers that give millions of compounds.",
    explain: `
<p>Scientists know <b>millions</b> of carbon compounds. That is more than the compounds of all other elements put together! Carbon has two special powers that make this possible.</p>
<p><b>Superpower 1: Catenation</b></p>
<p><b>Catenation</b> means carbon atoms can join to <b>other carbon atoms</b> again and again. This makes big molecules with:</p>
<ul>
  <li>long chains,</li>
  <li>branched chains,</li>
  <li>rings.</li>
</ul>
<p>The carbons can be joined by single, double or triple bonds. The C–C bond is <b>very strong</b>, so these chains are stable.</p>
<p>No other element does this so well. <b>Silicon</b> can make chains of only <b>7 or 8 atoms</b>, and those are very reactive.</p>
<p><b>Superpower 2: Tetravalency</b></p>
<p><b>Tetravalency</b> means carbon has a valency of <b>4</b>. It can make 4 bonds. So it can bond with 4 other carbons, or with atoms like hydrogen, oxygen, nitrogen, sulphur and chlorine.</p>
<ul>
  <li>Carbon's bonds with most elements are very strong, so its compounds are very stable.</li>
  <li>One reason: carbon is a <b>small atom</b>. Its nucleus holds the shared electrons tightly. Bigger atoms make weaker bonds.</li>
</ul>
<p>Put the two powers together and you can build an almost endless number of different molecules.</p>
<div class="analogy">🚂 <b>Analogy:</b> Think of carbon as a toy train coach with <b>4 hooks</b> (tetravalency). Coaches can hook to other coaches forever (catenation). You can make a long train, a train with side branches, or even a circle track!</div>
<div class="note">💡 <b>Did you know?</b> People once believed carbon compounds could only be made inside living things, using a "vital force". In 1828, Friedrich Wöhler made <b>urea</b> from <b>ammonium cyanate</b> in a lab and proved them wrong.</div>
`,
    keyPoints: [
      "Catenation: carbon bonds with other carbon atoms to form chains, branches and rings.",
      "Tetravalency: carbon has valency 4, so it can make 4 bonds.",
      "Silicon chains reach only 7–8 atoms and are very reactive.",
      "Carbon's small size makes its bonds strong and its compounds stable."
    ],
    playHint: "Tap <b>Add carbon</b> to grow a chain up to 8 carbons and watch the formula and name change. Tap a carbon to count its 4 bonds, or tap an H to swap it for Cl.",
    textbookRef: "Section 4.2",
    quiz: [
      {
        q: "What is catenation?",
        options: ["Carbon losing 4 electrons", "Carbon reacting with oxygen", "Carbon forming ions", "Carbon bonding with other carbon atoms to form chains"],
        answer: 3,
        why: "Catenation is carbon's ability to link to other carbon atoms, making long chains, branches and rings."
      },
      {
        q: "Why are carbon's bonds with other elements so strong?",
        options: ["Carbon is a metal", "Carbon is a small atom, so its nucleus holds shared electrons tightly", "Carbon has 8 valence electrons", "Carbon forms ions easily"],
        answer: 1,
        why: "A small atom keeps the shared electron pairs close to its nucleus, so the bond is held strongly."
      }
    ]
  },

  // 5 ------------------------------------------------------------------
  {
    id: "saturated-unsaturated",
    title: "Saturated or Unsaturated?",
    emoji: "🍽️",
    tagline: "Single bonds only, or double and triple too?",
    explain: `
<p>When you eat until you cannot eat any more, you are "full". Some carbon compounds are "full" too. Chemists call them <b>saturated</b>.</p>
<p>First, a new word: a <b>hydrocarbon</b> is a compound made of only <b>carbon and hydrogen</b>.</p>
<p><b>Building ethane, C<sub>2</sub>H<sub>6</sub></b></p>
<ul>
  <li>Step 1: join two carbons with a single bond, C–C.</li>
  <li>Step 2: each carbon has 3 bonds left. Attach 3 H atoms to each.</li>
</ul>
<p>Now every bond is a single bond. Compounds like this are <b>saturated compounds</b>. They are normally <b>not very reactive</b>.</p>
<p><b>Building ethene, C<sub>2</sub>H<sub>4</sub></b></p>
<ul>
  <li>Join C–C, then add 2 H to each carbon.</li>
  <li>Each carbon still has one free bond. The only way to use it is a <b>double bond</b>: C=C.</li>
</ul>
<p><b>Ethyne, C<sub>2</sub>H<sub>2</sub></b>, has a <b>triple bond</b>: H–C≡C–H.</p>
<p>Compounds with double or triple bonds between carbons are <b>unsaturated</b>. They are <b>more reactive</b> than saturated ones.</p>
<table>
  <tr><th>Family</th><th>Type</th><th>Bond</th><th>Example</th></tr>
  <tr><td><b>Alkanes</b></td><td>Saturated</td><td>Only single (C–C)</td><td>Ethane, C<sub>2</sub>H<sub>6</sub></td></tr>
  <tr><td><b>Alkenes</b></td><td>Unsaturated</td><td>One or more double (C=C)</td><td>Ethene, C<sub>2</sub>H<sub>4</sub></td></tr>
  <tr><td><b>Alkynes</b></td><td>Unsaturated</td><td>One or more triple (C≡C)</td><td>Ethyne, C<sub>2</sub>H<sub>2</sub></td></tr>
</table>
<div class="analogy">🚌 <b>Analogy:</b> A saturated compound is like a full bus: every seat has a hydrogen in it. In an unsaturated compound, some seats are kept free because the two carbons hold hands twice or three times. When new atoms come, the carbons let go of a hand and give them those seats. So it reacts more easily.</div>
`,
    keyPoints: [
      "Hydrocarbon = compound of only carbon and hydrogen.",
      "Saturated: only single C–C bonds (alkanes); not very reactive.",
      "Unsaturated: double (alkenes) or triple (alkynes) C–C bonds; more reactive.",
      "Ethane C<sub>2</sub>H<sub>6</sub>, ethene C<sub>2</sub>H<sub>4</sub>, ethyne C<sub>2</sub>H<sub>2</sub>."
    ],
    playHint: "Tap single, double or triple bond (or tap the red bond itself) and watch hydrogens swing away or pop back. Change the chain to 2, 3 or 4 carbons and see the name, formula and family update.",
    textbookRef: "Section 4.2.1 (and 4.2.2)",
    quiz: [
      {
        q: "Ethene (C<sub>2</sub>H<sub>4</sub>) is unsaturated because it has…",
        options: ["only single bonds", "an oxygen atom", "a double bond between the carbons", "a ring of carbons"],
        answer: 2,
        why: "Each carbon has one bond left over after joining 2 H, so the carbons make a double bond, C=C. That makes ethene unsaturated."
      },
      {
        q: "Which of these is an alkane?",
        options: ["C<sub>3</sub>H<sub>8</sub> (propane)", "C<sub>2</sub>H<sub>2</sub> (ethyne)", "C<sub>2</sub>H<sub>4</sub> (ethene)", "C<sub>3</sub>H<sub>6</sub> (propene)"],
        answer: 0,
        why: "Propane has only single bonds, so it is a saturated hydrocarbon, an alkane. The others have double or triple bonds."
      }
    ]
  },

  // 6 ------------------------------------------------------------------
  {
    id: "chains-rings",
    title: "Chains, Branches and Rings",
    emoji: "💍",
    tagline: "Same atoms, different shapes: meet isomers.",
    explain: `
<p>LPG cylinders in our kitchens contain mostly <b>butane</b>. Butane can be built in <b>two different shapes</b>. Let us see how.</p>
<p><b>Straight chains</b></p>
<p>Carbons can join in a row. Here are the first six saturated hydrocarbons:</p>
<table>
  <tr><th>No. of C</th><th>Name</th><th>Formula</th></tr>
  <tr><td>1</td><td>Methane</td><td>CH<sub>4</sub></td></tr>
  <tr><td>2</td><td>Ethane</td><td>C<sub>2</sub>H<sub>6</sub></td></tr>
  <tr><td>3</td><td>Propane</td><td>C<sub>3</sub>H<sub>8</sub></td></tr>
  <tr><td>4</td><td>Butane</td><td>C<sub>4</sub>H<sub>10</sub></td></tr>
  <tr><td>5</td><td>Pentane</td><td>C<sub>5</sub>H<sub>12</sub></td></tr>
  <tr><td>6</td><td>Hexane</td><td>C<sub>6</sub>H<sub>14</sub></td></tr>
</table>
<p><b>Branched chains</b></p>
<p>Butane's 4 carbons can be arranged in two ways:</p>
<ul>
  <li>a straight chain: C–C–C–C</li>
  <li>a branched chain: three carbons in a row, with the fourth joined to the middle one. (This branched butane is sometimes called isobutane.)</li>
</ul>
<p>Both have the formula C<sub>4</sub>H<sub>10</sub>. Compounds with the <b>same molecular formula but different structures</b> are called <b>structural isomers</b>. Pentane has 3 isomers.</p>
<p><b>Rings</b></p>
<ul>
  <li><b>Cyclohexane, C<sub>6</sub>H<sub>12</sub></b>: six carbons in a ring, 2 H on each carbon. It is saturated.</li>
  <li><b>Benzene, C<sub>6</sub>H<sub>6</sub></b>: six carbons in a ring with <b>alternate single and double bonds</b>, 1 H on each carbon. It is unsaturated.</li>
</ul>
<p>Straight, branched and ring compounds can all be saturated or unsaturated.</p>
<div class="analogy">🧩 <b>Analogy:</b> Take the letters of "LISTEN". You can also make "SILENT". Same letters, different word! Isomers are the same atoms put together in a different shape.</div>
`,
    keyPoints: [
      "Carbon atoms can form straight chains, branched chains and rings.",
      "Structural isomers: same molecular formula, different structures.",
      "Butane (C<sub>4</sub>H<sub>10</sub>) has 2 isomers; pentane has 3.",
      "Cyclohexane is C<sub>6</sub>H<sub>12</sub> (saturated ring); benzene is C<sub>6</sub>H<sub>6</sub> (alternate double bonds)."
    ],
    playHint: "Drag the end carbon of butane onto the middle carbon to make branched butane, and see the formula is still C<sub>4</sub>H<sub>10</sub>. Then pick <b>6 carbons</b> and tap <b>Ring</b> and <b>Benzene</b> to bend hexane into cyclohexane and benzene.",
    textbookRef: "Section 4.2.2",
    quiz: [
      {
        q: "Straight-chain butane and branched butane are structural isomers. What do they share?",
        options: ["The same shape", "The same molecular formula, C<sub>4</sub>H<sub>10</sub>", "The same number of branches", "A ring of carbons"],
        answer: 1,
        why: "Isomers have the same molecular formula but different structures. Both forms of butane are C<sub>4</sub>H<sub>10</sub>."
      },
      {
        q: "What is the formula of cyclohexane?",
        options: ["C<sub>6</sub>H<sub>6</sub>", "C<sub>6</sub>H<sub>14</sub>", "C<sub>5</sub>H<sub>10</sub>", "C<sub>6</sub>H<sub>12</sub>"],
        answer: 3,
        why: "Six carbons in a ring, each with 2 hydrogens: 6 × 2 = 12 H. So cyclohexane is C<sub>6</sub>H<sub>12</sub>. (C<sub>6</sub>H<sub>6</sub> is benzene.)"
      }
    ]
  },

  // 7 ------------------------------------------------------------------
  {
    id: "functional-groups",
    title: "Carbon's Friends: Functional Groups",
    emoji: "🧩",
    tagline: "A small group that gives a compound its personality.",
    explain: `
<p>Why does vinegar taste sour but alcohol does not? Both have two carbons. The difference is a small group of atoms stuck to the chain.</p>
<p>Carbon is a "friendly" element. Besides hydrogen, it also bonds with <b>halogens</b> (chlorine, bromine), <b>oxygen</b>, <b>nitrogen</b> and <b>sulphur</b>.</p>
<ul>
  <li>In a hydrocarbon chain, one or more H atoms can be <b>replaced</b> by these elements.</li>
  <li>The element that replaces hydrogen is called a <b>heteroatom</b> ("hetero" means "different").</li>
</ul>
<p>A heteroatom, or a group that contains it, gives the compound <b>special properties</b>. It does this no matter how long the carbon chain is. Such a group is called a <b>functional group</b>.</p>
<p>The group joins the chain through its free bond (shown by a line), taking the place of a hydrogen.</p>
<table>
  <tr><th>Heteroatom</th><th>Class of compound</th><th>Functional group</th></tr>
  <tr><td>Cl / Br</td><td>Halo- (chloro/bromo) alkane</td><td>–Cl, –Br</td></tr>
  <tr><td>Oxygen</td><td>Alcohol</td><td>–OH</td></tr>
  <tr><td>Oxygen</td><td>Aldehyde</td><td>–CHO</td></tr>
  <tr><td>Oxygen</td><td>Ketone</td><td>&gt;C=O</td></tr>
  <tr><td>Oxygen</td><td>Carboxylic acid</td><td>–COOH</td></tr>
</table>
<p>Look closely at the oxygen groups:</p>
<ul>
  <li><b>Aldehyde, –CHO</b>: a carbon with one H and a double-bonded O. It sits at the end of a chain.</li>
  <li><b>Ketone, &gt;C=O</b>: a carbon with a double-bonded O and two free bonds, one on each side. It sits inside a chain.</li>
  <li><b>Carboxylic acid, –COOH</b>: a carbon with a double-bonded O and an –OH.</li>
</ul>
<div class="analogy">🎒 <b>Analogy:</b> The carbon chain is like a school bag. The functional group is the badge you pin on it. A long bag or a short bag, the badge tells everyone which club you belong to.</div>
`,
    keyPoints: [
      "Heteroatom = an atom (Cl, Br, O, N, S) that replaces H in a hydrocarbon.",
      "Functional group gives special properties, whatever the chain length.",
      "–OH alcohol, –CHO aldehyde, &gt;C=O ketone, –COOH carboxylic acid, –Cl/–Br haloalkane."
    ],
    playHint: "Tap –Cl, –Br, –OH, –CHO, &gt;C=O or –COOH to clip it onto a 3-carbon chain and see the name and family change.",
    textbookRef: "Section 4.2.3",
    quiz: [
      {
        q: "Which functional group is found in alcohols?",
        options: ["–OH", "–COOH", "–CHO", "&gt;C=O"],
        answer: 0,
        why: "Alcohols have the –OH group. –COOH is carboxylic acid, –CHO is aldehyde and &gt;C=O is ketone."
      },
      {
        q: "What is a heteroatom?",
        options: ["Any carbon atom in a chain", "A hydrogen atom at the end of a chain", "An atom other than C and H that replaces hydrogen in a carbon compound", "An atom that has lost all its electrons"],
        answer: 2,
        why: "A heteroatom (like O, Cl or N) takes the place of a hydrogen in the chain. 'Hetero' means 'different'."
      }
    ]
  },

  // 8 ------------------------------------------------------------------
  {
    id: "homologous-series",
    title: "Chemical Families: Homologous Series",
    emoji: "👨‍👩‍👧‍👦",
    tagline: "Add one –CH2– and meet the next family member.",
    explain: `
<p>In a family, brothers and sisters look alike but grow taller with age. Carbon compounds have families too!</p>
<p>Look at these alcohols: CH<sub>3</sub>OH, C<sub>2</sub>H<sub>5</sub>OH, C<sub>3</sub>H<sub>7</sub>OH, C<sub>4</sub>H<sub>9</sub>OH. They all have the same functional group, –OH. So they behave in very similar ways.</p>
<p>A <b>homologous series</b> is a series of compounds in which the <b>same functional group</b> replaces hydrogen in a carbon chain.</p>
<p><b>The magic step: –CH<sub>2</sub>–</b></p>
<p>Each member differs from the next by one <b>–CH<sub>2</sub>–</b> unit.</p>
<ul>
  <li>CH<sub>4</sub> → C<sub>2</sub>H<sub>6</sub>: add CH<sub>2</sub></li>
  <li>C<sub>2</sub>H<sub>6</sub> → C<sub>3</sub>H<sub>8</sub>: add CH<sub>2</sub></li>
  <li>Mass difference = 12 + 1 + 1 = <b>14 u</b> (C = 12 u, H = 1 u)</li>
</ul>
<p><b>General formulas</b> (n = number of carbons):</p>
<table>
  <tr><th>Series</th><th>General formula</th><th>Members</th></tr>
  <tr><td>Alkanes</td><td>C<sub>n</sub>H<sub>2n+2</sub></td><td>CH<sub>4</sub>, C<sub>2</sub>H<sub>6</sub>, C<sub>3</sub>H<sub>8</sub>…</td></tr>
  <tr><td>Alkenes</td><td>C<sub>n</sub>H<sub>2n</sub> (n = 2, 3, 4…)</td><td>C<sub>2</sub>H<sub>4</sub>, C<sub>3</sub>H<sub>6</sub>, C<sub>4</sub>H<sub>8</sub>, C<sub>5</sub>H<sub>10</sub></td></tr>
  <tr><td>Alkynes</td><td>C<sub>n</sub>H<sub>2n–2</sub></td><td>C<sub>2</sub>H<sub>2</sub>, C<sub>3</sub>H<sub>4</sub>…</td></tr>
</table>
<p><b>What changes and what stays the same?</b></p>
<ul>
  <li><b>Physical properties change gradually</b> as the molecules get heavier. Melting and boiling points rise. Solubility also changes slowly.</li>
  <li><b>Chemical properties stay similar</b>, because they depend only on the functional group.</li>
</ul>
<div class="analogy">🪜 <b>Analogy:</b> A homologous series is like a staircase. Every step is the same height (one –CH<sub>2</sub>–, 14 u). As you climb, you get higher (boiling point rises), but you are still on the same staircase (same chemical behaviour).</div>
`,
    keyPoints: [
      "Homologous series: same functional group on carbon chains of different lengths.",
      "Next member differs by –CH<sub>2</sub>–, i.e. 14 u in mass.",
      "Alkanes C<sub>n</sub>H<sub>2n+2</sub>, alkenes C<sub>n</sub>H<sub>2n</sub>, alkynes C<sub>n</sub>H<sub>2n–2</sub>.",
      "Physical properties change gradually; chemical properties stay similar."
    ],
    playHint: "Tap <b>Add –CH<sub>2</sub>–</b> to build the next alkane or alcohol. Watch the mass go up by 14 u and the boiling-point bar rise. Try to guess the “?” bars first!",
    textbookRef: "Section 4.2.4",
    quiz: [
      {
        q: "By how much does the molecular mass change between two neighbours in a homologous series?",
        options: ["12 u", "2 u", "16 u", "14 u"],
        answer: 3,
        why: "Neighbours differ by –CH<sub>2</sub>–. That is 12 + 1 + 1 = 14 u."
      },
      {
        q: "Why do members of the same homologous series have similar chemical properties?",
        options: ["They have the same boiling point", "They have the same functional group", "They have the same mass", "They are all gases"],
        answer: 1,
        why: "Chemical properties depend on the functional group. All members share it, so they react in similar ways."
      }
    ]
  },

  // 9 ------------------------------------------------------------------
  {
    id: "nomenclature",
    title: "Naming Carbon Compounds",
    emoji: "🏷️",
    tagline: "Count the carbons, add the right ending, done!",
    explain: `
<p>Your full name tells people your family name and your own name. A carbon compound's name works the same way. It tells you <b>how many carbons</b> it has and <b>which functional group</b> it carries.</p>
<p>A <b>prefix</b> is a part added <b>before</b> a word. A <b>suffix</b> is a part added <b>after</b> a word.</p>
<p><b>The 4-step method</b></p>
<ol>
  <li><b>Count the carbons</b> and find the chain name. 1 = meth, 2 = eth, 3 = prop, 4 = but, 5 = pent, 6 = hex. Example: 3 carbons = <b>propane</b>.</li>
  <li><b>Find the functional group</b> and its prefix or suffix (see the table).</li>
  <li>If the suffix starts with a vowel (a, e, i, o, u), <b>drop the final "e"</b> of the chain name. Example: propane – e + one = <b>propanone</b>.</li>
  <li>If the chain has a double bond, change "ane" to <b>"ene"</b>. For a triple bond, use <b>"yne"</b>. Examples: <b>propene</b>, <b>propyne</b>.</li>
</ol>
<table>
  <tr><th>Class</th><th>Prefix / Suffix</th><th>Example</th></tr>
  <tr><td>Halo alkane</td><td>Prefix: chloro, bromo</td><td>Chloropropane, Bromopropane</td></tr>
  <tr><td>Alcohol</td><td>Suffix: -ol</td><td>Propanol</td></tr>
  <tr><td>Aldehyde</td><td>Suffix: -al</td><td>Propanal</td></tr>
  <tr><td>Ketone</td><td>Suffix: -one</td><td>Propanone</td></tr>
  <tr><td>Carboxylic acid</td><td>Suffix: -oic acid</td><td>Propanoic acid</td></tr>
  <tr><td>Alkene</td><td>Suffix: -ene</td><td>Propene</td></tr>
  <tr><td>Alkyne</td><td>Suffix: -yne</td><td>Propyne</td></tr>
</table>
<p>More examples: CH<sub>3</sub>–CH<sub>2</sub>–Br is <b>bromoethane</b>. HCHO is <b>methanal</b>. The alcohols are methanol, ethanol, propanol and butanol.</p>
<div class="analogy">🍕 <b>Analogy:</b> Naming is like ordering a pizza. The base size is the number of carbons (prop = 3). The topping is the functional group (-ol, -al, -one). "Propanol" means "3-carbon base with the alcohol topping".</div>
`,
    keyPoints: [
      "Chain names: meth (1), eth (2), prop (3), but (4), pent (5), hex (6).",
      "-ol alcohol, -al aldehyde, -one ketone, -oic acid carboxylic acid; chloro-/bromo- prefix.",
      "Drop the final 'e' before a suffix starting with a vowel: propanone.",
      "Double bond: -ene (propene); triple bond: -yne (propyne)."
    ],
    playHint: "Pick a carbon count and a group to see the name built from stem + suffix (or prefix). Then switch to the quiz and name the molecule from tiles.",
    textbookRef: "Section 4.2.5",
    quiz: [
      {
        q: "A 3-carbon chain with an aldehyde group (–CHO) is called…",
        options: ["Propanol", "Propanone", "Propanal", "Propanoic acid"],
        answer: 2,
        why: "3 carbons = prop. Aldehyde suffix = -al. Drop the 'e' of propane and add 'al': propanal."
      },
      {
        q: "What is the name of CH<sub>3</sub>–CH<sub>2</sub>–Br?",
        options: ["Bromoethane", "Bromomethane", "Ethanol", "Bromopropane"],
        answer: 0,
        why: "There are 2 carbons (ethane) and a bromine, which uses the prefix 'bromo'. So it is bromoethane."
      }
    ]
  },

  // 10 -----------------------------------------------------------------
  {
    id: "combustion",
    title: "Fire! Combustion",
    emoji: "🔥",
    tagline: "Why your gas stove burns blue, not yellow.",
    explain: `
<p>Look at the LPG stove in your kitchen. The flame is <b>blue</b>. But a candle flame is <b>yellow</b>. Why?</p>
<p><b>Combustion</b> means burning a substance in oxygen. It gives out <b>heat and light</b>. Carbon, in all its forms, burns in oxygen to give carbon dioxide. Most carbon compounds also give lots of heat and light. That is why they are used as <b>fuels</b>.</p>
<div class="eq">C + O<sub>2</sub> → CO<sub>2</sub> + heat and light</div>
<div class="eq">CH<sub>4</sub> + 2O<sub>2</sub> → CO<sub>2</sub> + 2H<sub>2</sub>O + heat and light</div>
<div class="eq">C<sub>2</sub>H<sub>5</sub>OH + 3O<sub>2</sub> → 2CO<sub>2</sub> + 3H<sub>2</sub>O + heat and light</div>
<p><b>Blue flame or yellow flame?</b></p>
<ul>
  <li><b>Saturated hydrocarbons</b> usually burn with a <b>clean flame</b>.</li>
  <li><b>Unsaturated compounds</b> burn with a <b>yellow flame and lots of black smoke</b>. The smoke leaves <b>soot</b> (black carbon).</li>
  <li>If <b>air is limited</b>, burning is <b>incomplete</b>. Then even saturated fuels give a sooty flame.</li>
</ul>
<p>Gas and kerosene stoves have <b>air holes</b>. Fuel mixed with enough oxygen burns with a <b>clean blue flame</b>. If your pots turn black at the bottom, the air holes are blocked and <b>fuel is being wasted</b>.</p>
<p>Coal and petroleum also contain some nitrogen and sulphur. Burning them makes <b>oxides of sulphur and nitrogen</b>, which are major <b>air pollutants</b>.</p>
<div class="analogy">🏃 <b>Analogy:</b> Running a race with enough air to breathe, you finish strong (complete burning, blue flame). Running with a blocked nose, you get tired and leave things half done (incomplete burning, soot).</div>
<div class="note">💡 <b>Did you know?</b> A flame appears only when <b>gases</b> burn. Charcoal in an angithi just glows red. A candle flame is yellow because tiny unburnt carbon bits glow in it.</div>
<div class="note">💡 <b>Did you know?</b> Coal formed from plants buried millions of years ago. Oil and gas formed from tiny sea plants and animals, changed by bacteria under high pressure. So they are called <b>fossil fuels</b>.</div>
`,
    keyPoints: [
      "Carbon and its compounds burn in oxygen to give CO<sub>2</sub>, heat and light.",
      "CH<sub>4</sub> + 2O<sub>2</sub> → CO<sub>2</sub> + 2H<sub>2</sub>O.",
      "Saturated: clean blue flame. Unsaturated or less air: yellow, sooty flame.",
      "Blackened vessel bottoms mean incomplete combustion and wasted fuel.",
      "Burning coal and petroleum releases oxides of sulphur and nitrogen (pollutants)."
    ],
    playHint: "Slide the air hole open or closed (for methane or ethyne) and watch the flame change between yellow and sooty, which blackens the plate, and clean blue.",
    textbookRef: "Section 4.3.1",
    quiz: [
      {
        q: "The bottom of a cooking pot is turning black. What does it mean?",
        options: ["The food is not cooked", "The fuel is not burning completely", "The fuel is wet", "The fuel is burning completely"],
        answer: 1,
        why: "Soot means incomplete combustion. The air holes are blocked, so not enough oxygen reaches the fuel and fuel is wasted."
      },
      {
        q: "Which kind of fuel usually burns with a yellow, smoky flame?",
        options: ["Saturated hydrocarbons in plenty of air", "Methane in a clean stove", "Hydrogen gas", "Unsaturated carbon compounds"],
        answer: 3,
        why: "Unsaturated compounds burn with a yellow flame and lots of black smoke. Saturated ones give a clean flame when there is enough air."
      }
    ]
  },

  // 11 -----------------------------------------------------------------
  {
    id: "oxidation",
    title: "Oxidation: Alcohol to Acid",
    emoji: "🧪",
    tagline: "Add oxygen and ethanol becomes ethanoic acid.",
    explain: `
<p>Have you seen a cut apple turn brown? That happens because it reacts with oxygen. Carbon compounds can also react with oxygen in a slow, controlled way, not only by burning.</p>
<p><b>Oxidation</b> means adding oxygen to a substance. Burning (combustion) is <b>complete</b> oxidation. But we can also oxidise gently.</p>
<p><b>Ethanol to ethanoic acid</b></p>
<p>Alcohols can be changed into <b>carboxylic acids</b>. Ethanol becomes ethanoic acid:</p>
<div class="eq">CH<sub>3</sub>–CH<sub>2</sub>OH → CH<sub>3</sub>COOH &nbsp;(alkaline KMnO<sub>4</sub> + heat, or acidified K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub> + heat)</div>
<p>Look at what changed: the molecule <b>gained an oxygen</b> and <b>lost two hydrogens</b>. Both are signs of oxidation.</p>
<p><b>Oxidising agents</b> are substances that can <b>add oxygen to others</b>. Two common ones:</p>
<ul>
  <li><b>Alkaline potassium permanganate</b> (KMnO<sub>4</sub>), which is purple.</li>
  <li><b>Acidified potassium dichromate</b> (K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub>), which is orange.</li>
</ul>
<p><b>The colour test (Activity 4.5)</b></p>
<ul>
  <li>Warm a little ethanol in a water bath.</li>
  <li>Add 5% alkaline KMnO<sub>4</sub> drop by drop.</li>
  <li>At first the <b>purple colour disappears</b>. It is used up in oxidising the ethanol.</li>
  <li>When all the ethanol is used up, extra drops <b>stay purple</b>.</li>
</ul>
<div class="analogy">🎨 <b>Analogy:</b> The KMnO<sub>4</sub> is like a painter who gives away purple paint to every ethanol molecule. While there is ethanol, the paint keeps disappearing. When no ethanol is left, the purple stays on the wall.</div>
`,
    keyPoints: [
      "Ethanol → ethanoic acid with alkaline KMnO<sub>4</sub> + heat or acidified K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub> + heat.",
      "Oxidising agent = a substance that adds oxygen to another substance.",
      "Combustion is complete oxidation.",
      "KMnO<sub>4</sub>'s purple colour disappears while ethanol is still present."
    ],
    playHint: "Tap the dropper to add alkaline KMnO<sub>4</sub> (or acidified K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub>) to warm ethanol. While ethanol is turning into ethanoic acid, the purple colour disappears (orange dichromate turns green). Once all the ethanol is used up, the colour stays. Try a cold bath too!",
    textbookRef: "Section 4.3.2",
    quiz: [
      {
        q: "What does an oxidising agent do?",
        options: ["Adds oxygen to another substance", "Removes oxygen from a substance", "Adds hydrogen to a substance", "Makes a substance burn with a sooty flame"],
        answer: 0,
        why: "Oxidising agents like alkaline KMnO<sub>4</sub> and acidified K<sub>2</sub>Cr<sub>2</sub>O<sub>7</sub> give oxygen to other substances."
      },
      {
        q: "Purple KMnO<sub>4</sub> is added drop by drop to warm ethanol. Why does the colour disappear at first?",
        options: ["The ethanol evaporates", "KMnO<sub>4</sub> is a dye that fades in heat", "KMnO<sub>4</sub> is used up in oxidising the ethanol", "The water bath washes it away"],
        answer: 2,
        why: "While ethanol is present, the KMnO<sub>4</sub> reacts with it and is used up. When all the ethanol is oxidised, the purple colour stays."
      }
    ]
  },

  // 12 -----------------------------------------------------------------
  {
    id: "addition",
    title: "Addition: Adding Hydrogen",
    emoji: "➕",
    tagline: "How liquid oil can be turned into solid fat.",
    explain: `
<p>Some cooking fats come as a soft solid in a tin. Many people call this "vanaspati" ghee. It can be made from liquid vegetable oil. How? By adding hydrogen!</p>
<p>Remember: <b>unsaturated</b> compounds have double or triple bonds. They have room for more atoms.</p>
<p>In an <b>addition reaction</b>, unsaturated hydrocarbons <b>add hydrogen</b> to become <b>saturated</b>. This needs a <b>catalyst</b> such as <b>nickel</b> or <b>palladium</b>.</p>
<p>A <b>catalyst</b> is a substance that makes a reaction happen, or changes its speed, <b>without being changed itself</b>.</p>
<div class="eq">R<sub>2</sub>C=CR<sub>2</sub> + H<sub>2</sub> → R<sub>2</sub>CH–CHR<sub>2</sub> &nbsp;(nickel catalyst)</div>
<p>Here R stands for the rest of the molecule. The double bond opens up into a single bond, and each carbon gets one new H.</p>
<p><b>Hydrogenation of vegetable oils</b></p>
<ul>
  <li>Adding hydrogen this way is called <b>hydrogenation</b>.</li>
  <li>It is used to hydrogenate <b>vegetable oils</b> using a <b>nickel catalyst</b>.</li>
  <li>Vegetable oils have long <b>unsaturated</b> carbon chains.</li>
  <li>Animal fats have <b>saturated</b> carbon chains.</li>
</ul>
<p><b>Health note:</b> animal fats contain <b>saturated fatty acids</b>, which are said to be harmful for health. So we should choose <b>oils with unsaturated fatty acids</b> for cooking.</p>
<p>Only unsaturated compounds can do addition. For example, C<sub>3</sub>H<sub>6</sub> and C<sub>2</sub>H<sub>2</sub> can, but CH<sub>4</sub> and C<sub>2</sub>H<sub>6</sub> cannot.</p>
<div class="analogy">🤲 <b>Analogy:</b> Two carbons in a double bond are holding hands twice. When hydrogen arrives, each carbon lets go of one hand to hold a hydrogen instead. The nickel catalyst is the teacher who helps them switch but stays the same.</div>
`,
    keyPoints: [
      "Addition: unsaturated hydrocarbon + H<sub>2</sub> → saturated hydrocarbon (Ni or Pd catalyst).",
      "Catalyst: changes the rate of a reaction without being affected itself.",
      "Vegetable oils (unsaturated) are hydrogenated using a nickel catalyst.",
      "Animal fats are saturated; unsaturated oils are better for cooking.",
      "Only unsaturated compounds (like C<sub>3</sub>H<sub>6</sub>, C<sub>2</sub>H<sub>2</sub>) undergo addition."
    ],
    playHint: "Drag H<sub>2</sub> onto the C=C of an oil molecule. Without the nickel catalyst it bounces off; with it, H<sub>2</sub> adds across the double bond and the liquid oil slowly turns into solid fat.",
    textbookRef: "Section 4.3.3",
    quiz: [
      {
        q: "Which of these can undergo an addition reaction with hydrogen?",
        options: ["CH<sub>4</sub>", "C<sub>2</sub>H<sub>6</sub>", "C<sub>3</sub>H<sub>8</sub>", "C<sub>2</sub>H<sub>2</sub>"],
        answer: 3,
        why: "C<sub>2</sub>H<sub>2</sub> (ethyne) has a triple bond, so it is unsaturated and can add hydrogen. The others are saturated alkanes."
      },
      {
        q: "What does the nickel do in the hydrogenation of vegetable oil?",
        options: ["It becomes part of the fat", "It acts as a catalyst", "It removes hydrogen", "It adds oxygen"],
        answer: 1,
        why: "Nickel is a catalyst. It helps hydrogen add to the oil but is not used up or changed."
      }
    ]
  },

  // 13 -----------------------------------------------------------------
  {
    id: "substitution",
    title: "Substitution: Swap a Hydrogen",
    emoji: "🔄",
    tagline: "In sunlight, chlorine kicks out hydrogen one by one.",
    explain: `
<p>In a cricket match, a substitute player takes the place of another player. Atoms can do this too!</p>
<p><b>Saturated hydrocarbons</b> (alkanes) are quite <b>unreactive</b>. Most chemicals do not affect them. But there is one big exception: <b>chlorine in sunlight</b>.</p>
<p>In the <b>presence of sunlight</b>, chlorine reacts with hydrocarbons very fast. Chlorine atoms replace the hydrogen atoms <b>one by one</b>.</p>
<p>A <b>substitution reaction</b> is a reaction in which one type of atom (or group of atoms) <b>takes the place of another</b>.</p>
<div class="eq">CH<sub>4</sub> + Cl<sub>2</sub> → CH<sub>3</sub>Cl + HCl &nbsp;(in the presence of sunlight)</div>
<p>Let us read this equation:</p>
<ul>
  <li>Methane (CH<sub>4</sub>) meets chlorine (Cl<sub>2</sub>).</li>
  <li>One Cl takes the place of one H on the carbon. This gives CH<sub>3</sub>Cl.</li>
  <li>The H that was pushed out joins the other Cl to make HCl.</li>
</ul>
<p>Because the hydrogens are replaced one by one, the reaction can go on: more H atoms can be swapped for Cl. Bigger alkanes usually give <b>many different products</b>.</p>
<p><b>Addition vs substitution:</b></p>
<ul>
  <li><b>Addition</b>: atoms are <b>added</b> to a double or triple bond (unsaturated compounds).</li>
  <li><b>Substitution</b>: one atom <b>replaces</b> another (saturated compounds).</li>
</ul>
<div class="analogy">⚽ <b>Analogy:</b> Think of a football team on the field. The number of players stays the same. When a substitute comes in, one player goes out. Cl comes in, H goes out, and the H leaves with a Cl as HCl.</div>
`,
    keyPoints: [
      "Substitution: one atom or group takes the place of another.",
      "CH<sub>4</sub> + Cl<sub>2</sub> → CH<sub>3</sub>Cl + HCl, in the presence of sunlight.",
      "Chlorine replaces hydrogen atoms one by one.",
      "Saturated hydrocarbons are mostly unreactive, but react with chlorine in sunlight."
    ],
    playHint: "Turn on the sunlight and drag Cl<sub>2</sub> onto methane. Each one swaps an H for a Cl and makes HCl: CH<sub>4</sub> → CH<sub>3</sub>Cl → CH<sub>2</sub>Cl<sub>2</sub> → CHCl<sub>3</sub> → CCl<sub>4</sub>. In the dark, nothing happens.",
    textbookRef: "Section 4.3.4",
    quiz: [
      {
        q: "What condition is needed for methane to react with chlorine?",
        options: ["Nickel catalyst", "Hot concentrated H<sub>2</sub>SO<sub>4</sub>", "Sunlight", "Freezing temperature"],
        answer: 2,
        why: "Methane and chlorine react in the presence of sunlight. Chlorine then replaces hydrogen atoms one by one."
      },
      {
        q: "In CH<sub>4</sub> + Cl<sub>2</sub> → CH<sub>3</sub>Cl + HCl, what has happened?",
        options: ["A chlorine atom has taken the place of a hydrogen atom", "Hydrogen has been added to a double bond", "Methane has burnt in oxygen", "Water has been removed"],
        answer: 0,
        why: "One H on the carbon is replaced by Cl. That is a substitution reaction. The removed H forms HCl."
      }
    ]
  },

  // 14 -----------------------------------------------------------------
  {
    id: "ethanol",
    title: "Ethanol: The Famous Alcohol",
    emoji: "🍶",
    tagline: "In cough syrups and fuels, but dangerous to drink.",
    explain: `
<p>Check the label on a cough syrup or tincture iodine bottle. You may see "alcohol". This is <b>ethanol, C<sub>2</sub>H<sub>5</sub>OH</b>.</p>
<p><b>Properties of ethanol</b></p>
<ul>
  <li>A <b>liquid</b> at room temperature (melts at 156 K, boils at 351 K).</li>
  <li>Commonly just called <b>alcohol</b>.</li>
  <li><b>Mixes with water in all proportions.</b></li>
  <li>A <b>good solvent</b> (it dissolves many things). So it is used in tincture iodine, cough syrups and tonics.</li>
  <li>It is the active part of all alcoholic drinks. Even a small amount of <b>pure ethanol (absolute alcohol) can kill</b>.</li>
</ul>
<p><b>Reaction 1: with sodium</b></p>
<div class="eq">2Na + 2CH<sub>3</sub>CH<sub>2</sub>OH → 2CH<sub>3</sub>CH<sub>2</sub>O<sup>–</sup>Na<sup>+</sup> + H<sub>2</sub></div>
<p>The products are <b>sodium ethoxide</b> and <b>hydrogen gas</b>. Hydrogen burns with a "pop" sound.</p>
<p><b>Reaction 2: removing water (dehydration)</b></p>
<div class="eq">CH<sub>3</sub>CH<sub>2</sub>OH → CH<sub>2</sub>=CH<sub>2</sub> + H<sub>2</sub>O &nbsp;(hot conc. H<sub>2</sub>SO<sub>4</sub>, 443 K)</div>
<p>Heating ethanol at <b>443 K</b> with <b>excess concentrated sulphuric acid</b> gives <b>ethene</b>. The acid is a <b>dehydrating agent</b>: it pulls water out of ethanol.</p>
<div class="analogy">🧽 <b>Analogy:</b> Concentrated H<sub>2</sub>SO<sub>4</sub> is like a super-dry sponge. It squeezes a water molecule out of each ethanol, and what is left is ethene.</div>
<div class="note">💡 <b>Did you know?</b> Large amounts of ethanol slow down the body and the brain. A drunk person loses balance, gets confused and sleepy, and cannot judge things properly.</div>
<div class="note">💡 <b>Did you know?</b> <b>Methanol</b> is far more dangerous. Even a little can kill. The liver turns it into methanal, which damages cells and the optic nerve, causing <b>blindness</b>. Industrial ethanol is mixed with methanol and a <b>blue dye</b> so nobody drinks it. This is <b>denatured alcohol</b>.</div>
<div class="note">💡 <b>Did you know?</b> Sugarcane juice gives <b>molasses</b>, which is fermented to make ethanol. Some countries add it to petrol because it is a <b>cleaner fuel</b>: in enough air it gives only CO<sub>2</sub> and water.</div>
`,
    keyPoints: [
      "Ethanol is a liquid (b.p. 351 K), soluble in water in all proportions, a good solvent.",
      "2Na + 2CH<sub>3</sub>CH<sub>2</sub>OH → 2CH<sub>3</sub>CH<sub>2</sub>ONa (sodium ethoxide) + H<sub>2</sub>.",
      "Hot conc. H<sub>2</sub>SO<sub>4</sub> at 443 K dehydrates ethanol to ethene.",
      "Methanol can cause blindness and death; denatured alcohol = ethanol + methanol + blue dye."
    ],
    playHint: "Drag sodium into ethanol to see bubbles, then test the gas with a burning splinter (POP!). Next, press and hold <b>Heat</b> on ethanol + conc. H<sub>2</sub>SO<sub>4</sub> until 443 K to make ethene, and watch the water leave.",
    textbookRef: "Section 4.4.1",
    quiz: [
      {
        q: "Which gas is given off when sodium reacts with ethanol?",
        options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Chlorine"],
        answer: 1,
        why: "2Na + 2CH<sub>3</sub>CH<sub>2</sub>OH → 2CH<sub>3</sub>CH<sub>2</sub>ONa + H<sub>2</sub>. The hydrogen gas burns with a 'pop'."
      },
      {
        q: "What is formed when ethanol is heated at 443 K with excess hot concentrated H<sub>2</sub>SO<sub>4</sub>?",
        options: ["Ethanoic acid", "Methane", "Sodium ethoxide", "Ethene"],
        answer: 3,
        why: "Concentrated H<sub>2</sub>SO<sub>4</sub> removes water from ethanol (dehydration), giving ethene, CH<sub>2</sub>=CH<sub>2</sub>."
      }
    ]
  },

  // 15 -----------------------------------------------------------------
  {
    id: "ethanoic-acid",
    title: "Ethanoic Acid: The Vinegar Acid",
    emoji: "🥒",
    tagline: "Keeps pickles fresh and makes sweet-smelling esters.",
    explain: `
<p>Your grandmother's pickles last for months. One secret is <b>vinegar</b>. Vinegar is a <b>5–8% solution of ethanoic acid in water</b>.</p>
<p><b>About ethanoic acid (CH<sub>3</sub>COOH)</b></p>
<ul>
  <li>Common name: <b>acetic acid</b>. It is a <b>carboxylic acid</b> (has –COOH).</li>
  <li>Pure ethanoic acid melts at <b>290 K</b>, so it often freezes in cold winters. That is why it is called <b>glacial acetic acid</b>.</li>
  <li>It is a <b>weak acid</b>. HCl is a strong acid because it ionises fully. Ethanoic acid does not.</li>
</ul>
<p><b>1. Esterification</b> (acid + alcohol → ester)</p>
<div class="eq">CH<sub>3</sub>COOH + CH<sub>3</sub>CH<sub>2</sub>OH → CH<sub>3</sub>–CO–O–CH<sub>2</sub>–CH<sub>3</sub> + H<sub>2</sub>O &nbsp;(acid catalyst)</div>
<p>The product is an <b>ester</b>. Esters smell <b>sweet and fruity</b>. They are used in <b>perfumes and flavours</b>.</p>
<p><b>Saponification</b> (ester + alkali → alcohol + salt)</p>
<div class="eq">CH<sub>3</sub>COOC<sub>2</sub>H<sub>5</sub> + NaOH → C<sub>2</sub>H<sub>5</sub>OH + CH<sub>3</sub>COONa</div>
<p>It is called saponification because it is <b>used to make soap</b>.</p>
<p><b>2. With a base</b></p>
<div class="eq">NaOH + CH<sub>3</sub>COOH → CH<sub>3</sub>COONa + H<sub>2</sub>O</div>
<p>The salt is <b>sodium ethanoate</b> (sodium acetate).</p>
<p><b>3. With carbonates and hydrogencarbonates</b></p>
<div class="eq">2CH<sub>3</sub>COOH + Na<sub>2</sub>CO<sub>3</sub> → 2CH<sub>3</sub>COONa + H<sub>2</sub>O + CO<sub>2</sub></div>
<div class="eq">CH<sub>3</sub>COOH + NaHCO<sub>3</sub> → CH<sub>3</sub>COONa + H<sub>2</sub>O + CO<sub>2</sub></div>
<p>The CO<sub>2</sub> gas turns <b>lime water milky</b>. Ethanol does not fizz like this, so this test tells an acid from an alcohol.</p>
<div class="analogy">🥤 <b>Analogy:</b> Drop baking soda (NaHCO<sub>3</sub>) into vinegar and it fizzes like a soda bottle. Those bubbles are carbon dioxide escaping!</div>
`,
    keyPoints: [
      "Vinegar = 5–8% ethanoic acid in water; used to preserve pickles.",
      "Pure ethanoic acid (m.p. 290 K) freezes in winter: glacial acetic acid.",
      "Acid + alcohol → sweet-smelling ester (acid catalyst); ester + NaOH → soap-making (saponification).",
      "With Na<sub>2</sub>CO<sub>3</sub>/NaHCO<sub>3</sub> it gives CO<sub>2</sub>, which turns lime water milky."
    ],
    playHint: "Four mini-labs: cool pure acid below its melting point (290 K, about 17 °C) to freeze it (“glacial”), compare it with HCl using indicators, make a fruity ester and then saponify it, and add sodium carbonate to turn lime water milky.",
    textbookRef: "Section 4.4.2",
    quiz: [
      {
        q: "Why is pure ethanoic acid called glacial acetic acid?",
        options: ["It freezes in cold winters (m.p. 290 K)", "It is found in glaciers", "It is a very strong acid", "It is blue in colour"],
        answer: 0,
        why: "Its melting point is 290 K (about 17 °C), so it often freezes in winter in cold places, looking like ice."
      },
      {
        q: "How can you tell ethanoic acid from ethanol using sodium hydrogencarbonate?",
        options: ["Ethanol fizzes, the acid does not", "Both turn blue", "The acid fizzes and gives CO<sub>2</sub>; ethanol does not", "Neither shows any change"],
        answer: 2,
        why: "CH<sub>3</sub>COOH + NaHCO<sub>3</sub> gives CO<sub>2</sub> gas, which turns lime water milky. Ethanol does not react this way."
      }
    ]
  },

  // 16 -----------------------------------------------------------------
  {
    id: "soaps-detergents",
    title: "Soaps and Detergents",
    emoji: "🧼",
    tagline: "How a tiny molecule pulls grease off your hands.",
    explain: `
<p>After eating pakoras, water alone cannot clean your oily hands. Add soap, and the oil washes away. How does soap do this?</p>
<p>Most dirt is <b>oily</b>, and oil does not mix with water. Soap is the bridge between them.</p>
<p><b>What is soap?</b> Soap molecules are <b>sodium or potassium salts of long-chain carboxylic acids</b>. Each molecule has two ends:</p>
<ul>
  <li>an <b>ionic head</b>: <b>hydrophilic</b> ("water-loving"), it stays in water;</li>
  <li>a long <b>carbon tail</b>: <b>hydrophobic</b> ("water-hating"), it sticks into oil.</li>
</ul>
<p><b>How soap cleans</b></p>
<ul>
  <li>The tails dig into the oily dirt. The heads face outwards, into the water.</li>
  <li>This makes a ball-shaped cluster called a <b>micelle</b>, with the dirt trapped in the centre.</li>
  <li>The micelles spread through the water as an <b>emulsion</b>. The heads push each other away (ion–ion repulsion), so micelles don't clump.</li>
  <li>Rinsing washes the micelles, and the dirt, away. Scrubbing helps the micelles grab the dirt.</li>
</ul>
<p>Soap solution looks <b>cloudy</b> because micelles are big enough to scatter light.</p>
<p><b>Hard water and scum</b></p>
<p><b>Hard water</b> has calcium and magnesium salts. Soap reacts with them to form <b>scum</b>, a white, curdy, insoluble solid. You get little foam and waste soap.</p>
<p><b>Detergents</b> fix this. They are usually <b>sodium salts of sulphonic acids</b> or <b>ammonium salts with chloride or bromide ions</b>. They also have a long carbon chain, but their charged ends <b>do not form scum</b> with calcium and magnesium. So they <b>work in hard water</b>. They are used in shampoos and washing powders.</p>
<div class="analogy">🙌 <b>Analogy:</b> A soap molecule is a person with one hand in the water and one hand on the oil. Many people stand in a circle around an oil drop, holding it inside, and the water carries the whole group away.</div>
<div class="note">💡 <b>Did you know?</b> You can make soap! Heat about 20 mL of vegetable oil (like soyabean oil) with 30 mL of 20% NaOH while stirring until it thickens. Add some common salt, stir, and let it cool. Do this only with a teacher, because NaOH burns skin.</div>
`,
    keyPoints: [
      "Soap = sodium or potassium salt of a long-chain carboxylic acid.",
      "Micelle: hydrophobic tails inside holding oil, ionic (hydrophilic) heads outside in water.",
      "Hard water has Ca and Mg salts; soap forms insoluble scum with them.",
      "Detergents (sodium salts of sulphonic acids, or ammonium salts) work even in hard water.",
      "Soap solution is cloudy because micelles scatter light."
    ],
    playHint: "Drag the oil drop into the water, add soap and watch a micelle form, then rinse it away. Switch to hard water to see soap make scum while detergent still cleans.",
    textbookRef: "Section 4.5",
    quiz: [
      {
        q: "In a micelle, where are the hydrocarbon tails of the soap molecules?",
        options: ["Outside, facing the water", "Floating freely in the air", "Joined to calcium ions", "Inside, pointing towards the oily dirt"],
        answer: 3,
        why: "The tails are hydrophobic and stick into the oil at the centre. The ionic heads face outward into the water."
      },
      {
        q: "Why do detergents work better than soap in hard water?",
        options: ["They have no carbon chain", "They do not form insoluble scum with calcium and magnesium ions", "They make the water soft by boiling it", "They contain more oil"],
        answer: 1,
        why: "Soap reacts with Ca and Mg salts to form scum. Detergents' charged ends do not form these precipitates, so they keep cleaning."
      }
    ]
  }
];
