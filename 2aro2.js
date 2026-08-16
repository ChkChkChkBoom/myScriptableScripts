// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: magic;
// assumes tarotData (assumes lucaLib)
// currently implemented:
// Unspecified (only order is given, not compatible with web display)
// Past/Present/Future (or any 3 card)
// CLArity
// CONnection
// Year AHead
// CHANGE THESE AS NEEDED
//Minor, Major, or Full<-(default)
const Selection="Full"
//render in web mode?
const Webview=true
//display symbolic info?
const Moreinfo=true
//which spread to use?
const Spreadused="PPF"
//only applies to unspecified spread
const Cards=3
//
// ACTUAL CODE
//
//fake modules
//return a copy of self
String.prototype.reflect=function(){return (this.slice(0,-1)).concat(this.slice(-1))}
//sdrawkcab ekaM
String.prototype.toReverse=function(){return this.reflect().split('').reverse().join('')}
//remove first instance of item
Array.prototype.delete=function(item){return [...this.slice(0,this.indexOf(item))].concat(this.slice(this.indexOf(item)+1))}
//remove all instances of item
Array.prototype.erase=function(item){let i=this;while (i.includes(item)){i=i.delete(item)};return i}
//remove item at index h
Array.prototype.excise=function(h){let out=[];for (let i=0;i<this.length;i++){if (i!=h){out.push(this[i])}};return out}
//shuffle a list
Array.prototype.shuffle=function(){
    let out=[...this]
    for (let i=1;i<out.length;i++) {
        let j = 0|Math.random()*(i+1);
        [out[i],out[j]]=[out[j],out[i]]
    }
    return out
}
function md5(str) {
  const bytes = Data.fromString(str).getBytes();
  const bitLength = bytes.length * 8;
  const paddedLength = ((bytes.length + 8) >> 6) * 64 + 64;
  const msg = new Array(paddedLength).fill(0);
  for (let i = 0; i < bytes.length; i++) {
    msg[i] = bytes[i];
  }
  msg[bytes.length] = 0x80;
  for (let i = 0; i < 8; i++) {
    msg[paddedLength - 8 + i] =
      Math.floor(bitLength / Math.pow(2, 8 * i)) & 0xff;
  }
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;
  const s = [
     7, 12, 17, 22,  7, 12, 17, 22,
     7, 12, 17, 22,  7, 12, 17, 22,
     5,  9, 14, 20,  5,  9, 14, 20,
     5,  9, 14, 20,  5,  9, 14, 20,
     4, 11, 16, 23,  4, 11, 16, 23,
     4, 11, 16, 23,  4, 11, 16, 23,
     6, 10, 15, 21,  6, 10, 15, 21,
     6, 10, 15, 21,  6, 10, 15, 21
  ];
  const K = [];
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(
      Math.abs(Math.sin(i + 1)) * 0x100000000
    ) >>> 0;
  }
  function leftRotate(x, n) {
    return ((x << n) | (x >>> (32 - n))) >>> 0;
  }
  function add(...values) {
    let result = 0;
    for (const value of values) {
      result = (result + value) >>> 0;
    }
    return result;
  }
  for (let offset = 0; offset < paddedLength; offset += 64) {
    const M = new Array(16);
    for (let i = 0; i < 16; i++) {
      const p = offset + i * 4;
      M[i] =
        (msg[p]) |
        (msg[p + 1] << 8) |
        (msg[p + 2] << 16) |
        (msg[p + 3] << 24);
    }
    let A = a0;
    let B = b0;
    let C = c0;
    let D = d0;
    for (let i = 0; i < 64; i++) {
      let F;
      let g;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      const oldD = D;
      D = C;
      C = B;
      B = add(
        B,
        leftRotate(
          add(A, F, K[i], M[g]),
          s[i]
        )
      );
      A = oldD;
    }
    a0 = add(a0, A);
    b0 = add(b0, B);
    c0 = add(c0, C);
    d0 = add(d0, D);
  }
  function wordToHex(word) {
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += ((word >>> (i * 8)) & 0xff)
        .toString(16)
        .padStart(2, "0");
    }
    return result;
  }
  return (
    wordToHex(a0) +
    wordToHex(b0) +
    wordToHex(c0) +
    wordToHex(d0)
  );
}
const dataMajor = {
  // ===================== MAJOR ARCANA =====================
  "fool": {
    "name": "The Fool",
    "link": "https://balatrowiki.org/images/The_Fool.png?95acc",
    "upright": "Beginnings, innocence, spontaneity, a free spirit",
    "reversed": "Holding back, recklessness, risk-taking"
  },
  "magician": {
    "name": "The Magician",
    "link": "https://balatrowiki.org/images/The_Magician.png?77d4e",
    "upright": "Willpower, desire, creation, manifestation",
    "reversed": "Trickery, illusions, out of touch"
  },
  "priestess": {
    "name": "The High Priestess",
    "link": "https://balatrowiki.org/images/The_High_Priestess.png?a13c4",
    "upright": "Intuitive, unconscious, inner voice",
    "reversed": "Disconnected from intuition, withdrawal, silence"
  },
  "empress": {
    "name": "The Empress",
    "link": "https://balatrowiki.org/images/The_Empress.png?c0110",
    "upright": "Motherhood, fertility, nature, abundance",
    "reversed": "Dependence, smothering, emptiness"
  },
  "emperor": {
    "name": "The Emperor",
    "link": "https://balatrowiki.org/images/The_Emperor.png?aa91e",
    "upright": "Authority, structure, control, fatherhood",
    "reversed": "Domination, excessive control, rigidity"
  },
  "hierophant": {
    "name": "The Hierophant",
    "link": "https://balatrowiki.org/images/The_Hierophant.png?db3f1",
    "upright": "Tradition, conformity, morality, ethics",
    "reversed": "Rebellion, subversiveness, new approaches"
  },
  "lovers": {
    "name": "The Lovers",
    "link": "https://balatrowiki.org/images/The_Lovers.png?47054",
    "upright": "Partnerships, duality, union, attraction",
    "reversed": "Imbalance, disharmony, misaligned values"
  },
  "chariot": {
    "name": "The Chariot",
    "link": "https://balatrowiki.org/images/The_Chariot.png?9460b",
    "upright": "Direction, control, willpower",
    "reversed": "Lack of control, opposition, lack of direction"
  },
  "strength": {
    "name": "Strength",
    "link": "https://balatrowiki.org/images/Strength.png?7e3d9",
    "upright": "Strength, courage, patience, compassion",
    "reversed": "Self-doubt, weakness, insecurity"
  },
  "hermit": {
    "name": "The Hermit",
    "link": "https://balatrowiki.org/images/The_Hermit.png?bdd40",
    "upright": "Contemplation, search for truth, inner guidance",
    "reversed": "Loneliness, isolation, losing your way"
  },
  "wheel": {
    "name": "Wheel of Fortune",
    "link": "https://balatrowiki.org/images/The_Wheel_of_Fortune.png?2b7b8",
    "upright": "Change, cycles, inevitable fate",
    "reversed": "No control, clinging to control, unwelcome change"
  },
  "justice": {
    "name": "Justice",
    "link": "https://balatrowiki.org/images/Justice.png?cf375",
    "upright": "Cause and effect, clarity, truth",
    "reversed": "Dishonesty, unaccountability, unfairness"
  },
  "hanged": {
    "name": "The Hanged Man",
    "link": "https://balatrowiki.org/images/The_Hanged_Man.png?8b665",
    "upright": "Sacrifice, release, martyrdom",
    "reversed": "Stalling, needless sacrifice, fear of sacrifice"
  },
  "death": {
    "name": "Death",
    "link": "https://balatrowiki.org/images/Death.png?de562",
    "upright": "Endings, transformation, transition",
    "reversed": "Resistance to change, inability to move on"
  },
  "temperance": {
    "name": "Temperance",
    "link": "https://balatrowiki.org/images/Temperance.png?24bf3",
    "upright": "Balance, moderation, patience, purpose",
    "reversed": "Imbalance, excess, lack of long-term vision"
  },
  "devil": {
    "name": "The Devil",
    "link": "https://balatrowiki.org/images/The_Devil.png?78f27",
    "upright": "Addiction, materialism, playfulness",
    "reversed": "Detachment, freedom, release, restoring control"
  },
  "tower": {
    "name": "The Tower",
    "link": "https://balatrowiki.org/images/The_Tower.png?b5305",
    "upright": "Sudden upheaval, broken pride, disaster",
    "reversed": "Personal transformation, fear of change"
  },
  "star": {
    "name": "The Star",
    "link": "https://balatrowiki.org/images/The_Star.png?fc5f1",
    "upright": "Hope, faith, purpose, renewal",
    "reversed": "Faithlessness, discouragement, insecurity"
  },
  "moon": {
    "name": "The Moon",
    "link": "https://balatrowiki.org/images/The_Moon.png?98507",
    "upright": "Unconscious, illusions, intuition",
    "reversed": "Confusion, fear, misinterpretation"
  },
  "sun": {
    "name": "The Sun",
    "link": "https://balatrowiki.org/images/The_Sun.png?70c19",
    "upright": "Joy, success, celebration, positivity",
    "reversed": "Egotism, unrealistic expectations, sadness"
  },
  "judgement": {
    "name": "Judgement",
    "link": "https://balatrowiki.org/images/Judgement.png?2e3c4",
    "upright": "Reflection, reckoning, awakening",
    "reversed": "Lack of self-awareness, doubt, self-loathing"
  },
  "world": {
    "name": "The World",
    "link": "https://balatrowiki.org/images/The_World.png?cbc88",
    "upright": "Fulfillment, harmony, completion",
    "reversed": "Incompletion, no closure, stagnation"
  }
}
let dM={
  // ===================== MINOR ARCANA — WANDS =====================
  "aceOfWands": {
    "name": "Ace of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Ace_of_Wands",
    "upright": "Inspiration, new opportunities, growth, potential",
    "reversed": "An emerging idea, lack of direction, distractions"
  },
  "twoOfWands": {
    "name": "Two of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Two_of_Wands",
    "upright": "Future planning, progress, decisions, discovery",
    "reversed": "Personal goals, inner alignment, fear of the unknown"
  },
  "threeOfWands": {
    "name": "Three of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Three_of_Wands",
    "upright": "Progress, expansion, foresight",
    "reversed": "Playing small, lack of foresight, unexpected delays"
  },
  "fourOfWands": {
    "name": "Four of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Four_of_Wands",
    "upright": "Celebration, joy, harmony, homecoming",
    "reversed": "Personal celebration, inner harmony, conflict with others"
  },
  "fiveOfWands": {
    "name": "Five of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Five_of_Wands",
    "upright": "Conflict, disagreements, competition",
    "reversed": "Inner conflict, conflict avoidance, tension release"
  },
  "sixOfWands": {
    "name": "Six of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Six_of_Wands",
    "upright": "Success, public recognition, progress",
    "reversed": "Excess pride, lack of recognition, punishment"
  },
  "sevenOfWands": {
    "name": "Seven of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Seven_of_Wands",
    "upright": "Challenge, competition, perseverance",
    "reversed": "Exhaustion, giving up, overwhelmed"
  },
  "eightOfWands": {
    "name": "Eight of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Eight_of_Wands",
    "upright": "Movement, fast-paced change, action",
    "reversed": "Delays, frustration, resisting change"
  },
  "nineOfWands": {
    "name": "Nine of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Nine_of_Wands",
    "upright": "Resilience, courage, persistence, boundaries",
    "reversed": "Inner resources, struggle, overwhelm, defensiveness"
  },
  "tenOfWands": {
    "name": "Ten of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Ten_of_Wands",
    "upright": "Burden, extra responsibility, hard work",
    "reversed": "Inability to delegate, overstressed, burnt out"
  },
  "pageOfWands": {
    "name": "Page of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Page_of_Wands",
    "upright": "Inspiration, ideas, discovery, free spirit",
    "reversed": "Setbacks, lack of direction, procrastination"
  },
  "knightOfWands": {
    "name": "Knight of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Knight_of_Wands",
    "upright": "Energy, passion, adventure, impulsiveness",
    "reversed": "Passion project, haste, scattered energy"
  },
  "queenOfWands": {
    "name": "Queen of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Queen_of_Wands",
    "upright": "Courage, confidence, independence, determination",
    "reversed": "Self-respect, self-confidence, introversion"
  },
  "kingOfWands": {
    "name": "King of Wands",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/King_of_Wands",
    "upright": "Big picture, leadership, vision, entrepreneurship",
    "reversed": "Impulsiveness, haste, ruthlessness, high expectations"
  },

  // ===================== MINOR ARCANA — CUPS =====================

  "aceOfCups": {
    "name": "Ace of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Ace_of_Cups",
    "upright": "Love, new relationships, compassion, creativity",
    "reversed": "Self-love, intuition, repressed emotions"
  },
  "twoOfCups": {
    "name": "Two of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Two_of_Cups",
    "upright": "Unity, partnership, mutual attraction",
    "reversed": "Break-up, imbalance, tension"
  },
  "threeOfCups": {
    "name": "Three of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Three_of_Cups",
    "upright": "Friendship, community, celebration",
    "reversed": "Overindulgence, gossip, isolation"
  },
  "fourOfCups": {
    "name": "Four of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Four_of_Cups",
    "upright": "Apathy, contemplation, disconnection",
    "reversed": "Sudden awareness, choosing happiness, acceptance"
  },
  "fiveOfCups": {
    "name": "Five of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Five_of_Cups",
    "upright": "Regret, failure, disappointment",
    "reversed": "Acceptance, moving on, finding peace"
  },
  "sixOfCups": {
    "name": "Six of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Six_of_Cups",
    "upright": "Nostalgia, childhood memories, innocence",
    "reversed": "Living in the past, forgiveness, lacking playfulness"
  },
  "sevenOfCups": {
    "name": "Seven of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Seven_of_Cups",
    "upright": "Opportunities, choices, wishful thinking",
    "reversed": "Alignment, personal values, overwhelmed by choices"
  },
  "eightOfCups": {
    "name": "Eight of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Eight_of_Cups",
    "upright": "Walking away, disillusionment, seeking truth",
    "reversed": "Fear of moving on, aimless drifting, stagnation"
  },
  "nineOfCups": {
    "name": "Nine of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Nine_of_Cups",
    "upright": "Contentment, satisfaction, gratitude",
    "reversed": "Inner happiness, materialism, dissatisfaction"
  },
  "tenOfCups": {
    "name": "Ten of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Ten_of_Cups",
    "upright": "Harmony, marriage, happiness, alignment",
    "reversed": "Disconnection, misaligned values, struggling relationships"
  },
  "pageOfCups": {
    "name": "Page of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Page_of_Cups",
    "upright": "Creativity, intuition, curiosity, possibility",
    "reversed": "Emotional immaturity, insecurity, disappointment"
  },
  "knightOfCups": {
    "name": "Knight of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Knight_of_Cups",
    "upright": "Romance, charm, imagination, beauty",
    "reversed": "Moodiness, unrealistic expectations, jealousy"
  },
  "queenOfCups": {
    "name": "Queen of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Queen_of_Cups",
    "upright": "Compassion, calm, comfort, intuition",
    "reversed": "Insecurity, dependence, martyrdom"
  },
  "kingOfCups": {
    "name": "King of Cups",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/King_of_Cups",
    "upright": "Emotional balance, compassion, diplomacy",
    "reversed": "Moodiness, coldness, manipulation"
  },

  // ===================== MINOR ARCANA — SWORDS =====================

  "aceOfSwords": {
    "name": "Ace of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Ace_of_Swords",
    "upright": "Breakthroughs, clarity, sharp mind",
    "reversed": "Confusion, brutality, chaos"
  },
  "twoOfSwords": {
    "name": "Two of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Two_of_Swords",
    "upright": "Difficult choices, indecision, stalemate",
    "reversed": "Confusion, information overload, indecision"
  },
  "threeOfSwords": {
    "name": "Three of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Three_of_Swords",
    "upright": "Heartbreak, grief, sorrow",
    "reversed": "Recovery, forgiveness, moving on"
  },
  "fourOfSwords": {
    "name": "Four of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Four_of_Swords",
    "upright": "Rest, relaxation, contemplation, recuperation",
    "reversed": "Exhaustion, burn-out, deep contemplation"
  },
  "fiveOfSwords": {
    "name": "Five of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Five_of_Swords",
    "upright": "Conflict, tension, loss, betrayal",
    "reversed": "Resentment, desire to reconcile, forgiveness"
  },
  "sixOfSwords": {
    "name": "Six of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Six_of_Swords",
    "upright": "Transition, change, moving on",
    "reversed": "Emotional baggage, unresolved issues, resisting transition"
  },
  "sevenOfSwords": {
    "name": "Seven of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Seven_of_Swords",
    "upright": "Deception, trickery, tactics, strategy",
    "reversed": "Coming clean, rethinking approach, self-deceit"
  },
  "eightOfSwords": {
    "name": "Eight of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Eight_of_Swords",
    "upright": "Restriction, imprisonment, self-victimization",
    "reversed": "Freedom, release, taking control"
  },
  "nineOfSwords": {
    "name": "Nine of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Nine_of_Swords",
    "upright": "Anxiety, worry, fear, depression",
    "reversed": "Hope, reaching out, releasing worry"
  },
  "tenOfSwords": {
    "name": "Ten of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Ten_of_Swords",
    "upright": "Painful endings, deep wounds, betrayal",
    "reversed": "Recovery, resisting the end, fear of ruin"
  },
  "pageOfSwords": {
    "name": "Page of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Page_of_Swords",
    "upright": "Curiosity, restlessness, mental energy",
    "reversed": "Deception, manipulation, all talk"
  },
  "knightOfSwords": {
    "name": "Knight of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Knight_of_Swords",
    "upright": "Ambition, action, fast thinking",
    "reversed": "Restlessness, impulsiveness, burn-out"
  },
  "queenOfSwords": {
    "name": "Queen of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Queen_of_Swords",
    "upright": "Independence, direct communication, clarity",
    "reversed": "Cold-heartedness, cruelty, bitterness"
  },
  "kingOfSwords": {
    "name": "King of Swords",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/King_of_Swords",
    "upright": "Mental clarity, intellectual power, truth",
    "reversed": "Manipulation, cruelty, weakness"
  },

  // ===================== MINOR ARCANA — PENTACLES =====================

  "aceOfPentacles": {
    "name": "Ace of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Ace_of_Pentacles",
    "upright": "New financial opportunity, abundance, prosperity",
    "reversed": "Lost opportunity, missed chance, scarcity"
  },
  "twoOfPentacles": {
    "name": "Two of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Two_of_Pentacles",
    "upright": "Balance, adaptability, time management",
    "reversed": "Overwhelm, disorganization, loss of balance"
  },
  "threeOfPentacles": {
    "name": "Three of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Three_of_Pentacles",
    "upright": "Teamwork, collaboration, learning",
    "reversed": "Disharmony, misalignment, working alone"
  },
  "fourOfPentacles": {
    "name": "Four of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Four_of_Pentacles",
    "upright": "Security, control, conservatism",
    "reversed": "Greed, materialism, insecurity, letting go"
  },
  "fiveOfPentacles": {
    "name": "Five of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Five_of_Pentacles",
    "upright": "Financial loss, poverty, isolation",
    "reversed": "Recovery, spiritual poverty, charity"
  },
  "sixOfPentacles": {
    "name": "Six of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Six_of_Pentacles",
    "upright": "Generosity, charity, sharing, giving",
    "reversed": "Strings attached, one-sidedness, power dynamics"
  },
  "sevenOfPentacles": {
    "name": "Seven of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Seven_of_Pentacles",
    "upright": "Patience, investment, long-term vision",
    "reversed": "Lack of long-term vision, limited success, impatience"
  },
  "eightOfPentacles": {
    "name": "Eight of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Eight_of_Pentacles",
    "upright": "Diligence, skill development, mastery",
    "reversed": "Perfectionism, lack of focus, misdirected activity"
  },
  "nineOfPentacles": {
    "name": "Nine of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Nine_of_Pentacles",
    "upright": "Independence, luxury, self-sufficiency",
    "reversed": "Financial setback, over-investment in work"
  },
  "tenOfPentacles": {
    "name": "Ten of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Ten_of_Pentacles",
    "upright": "Legacy, culmination, inheritance, family",
    "reversed": "Financial failure, loneliness, loss"
  },
  "pageOfPentacles": {
    "name": "Page of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Page_of_Pentacles",
    "upright": "Manifestation, ambition, diligence",
    "reversed": "Procrastination, lack of progress, unrealistic goals"
  },
  "knightOfPentacles": {
    "name": "Knight of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Knight_of_Pentacles",
    "upright": "Efficiency, hard work, responsibility",
    "reversed": "Laziness, obsessiveness, work without play"
  },
  "queenOfPentacles": {
    "name": "Queen of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/Queen_of_Pentacles",
    "upright": "Nurturing, practical, providing, down-to-earth",
    "reversed": "Financial independence, self-care, work-home imbalance"
  },
  "kingOfPentacles": {
    "name": "King of Pentacles",
    "link": "https://balatromods.miraheze.org/wiki/Paperback/King_of_Pentacles",
    "upright": "Abundance, prosperity, security",
    "reversed": "Financially inept, obsessed with wealth, stubbornness"
  }
};
//https://static.wikitide.net/balatromodswiki/8/89/Ace_of_Cups_%28Paperback%29.png
//really nice and friendly way of doing that, devs. makes my life sOoOoO easy
for (let i of Object.keys(dM)){
  let newLink="https://static.wikitide.net/balatromodswiki/"
  let filename=""
  for (let j of dM[i]["name"]){
    filename+=(j===" ")?"_":j
  }
  let altName=filename
  filename+="_(Paperback).png"
  altName+="_%28Paperback%29.png"
  let hash = md5(filename)
  newLink+=`${hash[0]}/${hash.slice(0, 2)}/${altName}`
  dM[i]["link"]=newLink
}
const dNames = {
  // Major Arcana
  "M00": "The Fool",
  "M01": "The Magician",
  "M02": "The High Priestess",
  "M03": "The Emperess",
  "M04": "The Emperor",
  "M05": "The Heirophant",
  "M06": "The Lovers",
  "M07": "The Chariot",
  "M08": "Justice",
  "M09": "The Hermit",
  "M10": "Wheel of Fortune",
  "M11": "Strength",
  "M12": "The Hanged Man",
  "M13": "Death",
  "M14": "Temperance",
  "M15": "The Devil",
  "M16": "The Tower",
  "M17": "The Star",
  "M18": "The Moon",
  "M19": "The Sun",
  "M20": "Judgement",
  "M21": "The World",

  // Wands
  "W01": "Ace of Wands",
  "W02": "Two of Wands",
  "W03": "Three of Wands",
  "W04": "Four of Wands",
  "W05": "Five of Wands",
  "W06": "Six of Wands",
  "W07": "Seven of Wands",
  "W08": "Eight of Wands",
  "W09": "Nine of Wands",
  "W10": "Ten of Wands",
  "W11": "Page of Wands",
  "W12": "Knight of Wands",
  "W13": "Queen of Wands",
  "W14": "King of Wands",

  // Cups
  "C01": "Ace of Cups",
  "C02": "Two of Cups",
  "C03": "Three of Cups",
  "C04": "Four of Cups",
  "C05": "Five of Cups",
  "C06": "Six of Cups",
  "C07": "Seven of Cups",
  "C08": "Eight of Cups",
  "C09": "Nine of Cups",
  "C10": "Ten of Cups",
  "C11": "Page of Cups",
  "C12": "Knight of Cups",
  "C13": "Queen of Cups",
  "C14": "King of Cups",

  // Swords
  "S01": "Ace of Swords",
  "S02": "Two of Swords",
  "S03": "Three of Swords",
  "S04": "Four of Swords",
  "S05": "Five of Swords",
  "S06": "Six of Swords",
  "S07": "Seven of Swords",
  "S08": "Eight of Swords",
  "S09": "Nine of Swords",
  "S10": "Ten of Swords",
  "S11": "Page of Swords",
  "S12": "Knight of Swords",
  "S13": "Queen of Swords",
  "S14": "King of Swords",

  // Pentacles
  "P01": "Ace of Pentacles",
  "P02": "Two of Pentacles",
  "P03": "Three of Pentacles",
  "P04": "Four of Pentacles",
  "P05": "Five of Pentacles",
  "P06": "Six of Pentacles",
  "P07": "Seven of Pentacles",
  "P08": "Eight of Pentacles",
  "P09": "Nine of Pentacles",
  "P10": "Ten of Pentacles",
  "P11": "Page of Pentacles",
  "P12": "Knight of Pentacles",
  "P13": "Queen of Pentacles",
  "P14": "King of Pentacles"
}
const iNames = {
  // Major Arcana
  "M00": "fool",
  "M01": "magician",
  "M02": "priestess",
  "M03": "emperess",
  "M04": "emperor",
  "M05": "hierophant",
  "M06": "lovers",
  "M07": "chariot",
  "M08": "justice",
  "M09": "hermit",
  "M10": "wheel",
  "M11": "strength",
  "M12": "hanged",
  "M13": "death",
  "M14": "temperance",
  "M15": "devil",
  "M16": "tower",
  "M17": "star",
  "M18": "moon",
  "M19": "sun",
  "M20": "judgement",
  "M21": "world",

  // Wands
  "W01": "aceOfWands",
  "W02": "twoOfWands",
  "W03": "threeOfWands",
  "W04": "fourOfWands",
  "W05": "fiveOfWands",
  "W06": "sixOfWands",
  "W07": "sevenOfWands",
  "W08": "eightOfWands",
  "W09": "nineOfWands",
  "W10": "tenOfWands",
  "W11": "pageOfWands",
  "W12": "knightOfWands",
  "W13": "queenOfWands",
  "W14": "kingOfWands",

  // Cups
  "C01": "aceOfCups",
  "C02": "twoOfCups",
  "C03": "threeOfCups",
  "C04": "fourOfCups",
  "C05": "fiveOfCups",
  "C06": "sixOfCups",
  "C07": "sevenOfCups",
  "C08": "eightOfCups",
  "C09": "nineOfCups",
  "C10": "tenOfCups",
  "C11": "pageOfCups",
  "C12": "knightOfCups",
  "C13": "queenOfCups",
  "C14": "kingOfCups",

  // Swords
  "S01": "aceOfSwords",
  "S02": "twoOfSwords",
  "S03": "threeOfSwords",
  "S04": "fourOfSwords",
  "S05": "fiveOfSwords",
  "S06": "sixOfSwords",
  "S07": "sevenOfSwords",
  "S08": "eightOfSwords",
  "S09": "nineOfSwords",
  "S10": "tenOfSwords",
  "S11": "pageOfSwords",
  "S12": "knightOfSwords",
  "S13": "queenOfSwords",
  "S14": "kingOfSwords",

  // Pentacles
  "P01": "aceOfPentacles",
  "P02": "twoOfPentacles",
  "P03": "threeOfPentacles",
  "P04": "fourOfPentacles",
  "P05": "fiveOfPentacles",
  "P06": "sixOfPentacles",
  "P07": "sevenOfPentacles",
  "P08": "eightOfPentacles",
  "P09": "nineOfPentacles",
  "P10": "tenOfPentacles",
  "P11": "pageOfPentacles",
  "P12": "knightOfPentacles",
  "P13": "queenOfPentacles",
  "P14": "kingOfPentacles"
}
let data={}
for (let i of Object.keys(dataMajor)){
  data[i]=dataMajor[i]
}
for (let i of Object.keys(dM)){
  data[i]=dM[i]
}
const spreadData={
  "PPF":{
    "positionMatrix":[
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,1,0,2,0,3,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0]
    ],
    "positionMeaning":{
      1:"Past",
      2:"Present",
      3:"Future"
    }
  },
  "CLA":{
    "positionMatrix":[
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0],
      [0,2,0,3,0,4,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0]
    ],
    "positionMeaning":{
      1:"Main Situation",
      2:"Factor 1",
      3:"Factor 2",
      4:"Factor 3"
    }
  },
  "CON":{
    "positionMatrix":[
      [0,0,0,0,0,0,0],
      [0,0,0,5,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,2,0,0,0,4,0],
      [0,0,1,0,3,0,0],
      [0,0,0,0,0,0,0]
    ],
    "positionMeaning":{
      1:"You",
      2:"Your Challenge",
      3:"Them",
      4:"Their Challenge",
      5:"Uniting Factor"
    }
  },
  "YAH":{
    //the "fun" one
    "positionMatrix":[
      [0, 0, 0, 1, 0, 0, 0],
      [0, 0, 12,0, 2, 0, 0],
      [0, 11,0, 0, 0, 3, 0],
      [10,0, 0, 13,0, 0, 4],
      [0, 9, 0, 0, 0, 5, 0],
      [0, 0, 8, 0, 6, 0, 0],
      [0, 0, 0, 7, 0, 0, 0]
    ],
    "positionMeaning":{
      1:"January",
      2:"February",
      3:"March",
      4:"April",
      5:"May",
      6:"June",
      7:"July",
      8:"August",
      9:"September",
      10:"October",
      11:"November",
      12:"December",
      13:"Summary"
    }
  }
}
const matrixTemplate=[
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0]
]
log=console.log
class WebView {
  constructor() { this.html = null; }
  loadHTML(html) { this.html = html; }
  async present(fullscreen) {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width:100%;height:500px;border:1px solid #ccc';
    document.body.appendChild(iframe);
    iframe.contentDocument.open();
    iframe.contentDocument.write(this.html);
    iframe.contentDocument.close();
  }
}
const SELECTION=(["minor","major","full"].includes(Selection.toLowerCase()))?Selection.toLowerCase():"full"
const WEBVIEW=Webview
const MOREINFO=Moreinfo
const SPREAD=Spreadused
const CARDS=Cards
let cd
let unspecified=false
switch (SPREAD){
  case "PPF":
    cd=3
    break
  case "CLA":
    cd=4
    break
  case "CON":
    cd=5
    break
  case "YAH":
    cd=13
    break
  default:
    log("Defaulted from "+SPREAD)
    cd=CARDS
    unspecified=true
}
const CARDSDRAWN=cd
const VERSION="3.0.0"
const NAMES=dNames
const INTERNALNAMES=iNames
const SPREADS=spreadData
//a little timesaver for later
const INV_MAP={
  "+":"Upright",
  "-":"Reversed"
}
//Functions:
function pm(){
  //randomly returns a + or -
  return (Math.random()<0.5)? "+":"-"
}
function forceZeroes(n,l){
  let preOut=String(n)
  let out=preOut.toReverse()
  let ll=l-(out.length)
  out=(out+dupe(ll,"0")).toReverse()
  return out
}
function initMajor(){
  let deck=[]
  for (let i=0;i<=21;i++){
    let sign=pm()
    let base=forceZeroes(i,2)
    let cardData="M"+base+sign
    deck.push(cardData)
  }
  deck=deck.shuffle()
  return deck
}
function initMinor(){
  let deck=[]
  //S-tier code coming up here
  for (let i of "WSCP"){
    for (let j=1;j<=14;j++){
      deck.push(i+forceZeroes(j,2)+pm())
    }
  }
  deck=deck.shuffle()
  return deck
}
function initFull(){
  //so advanced!
  let minor=initMinor()
  let major=initMajor()
  let full=[...minor,...major]
  full=full.shuffle()
  return full
}
function draw(deck,number){
  let results=[]
  for (let i=0;i<number;i++){
    results.push(new Result(deck[i]))
  }
  return results
}
function dupe(i,j){
  let out=""
  for (let k=0;k<i;k++){
    out+=j
  }
  return out
}
// a result needs location (maybe), position (definitely), and data (name, +/-, number, could be stored as XX+)
class Result{
  constructor(cardValue){
    this.cardValue=cardValue
    this.name=iNames[cardValue[0]+cardValue[1]+cardValue[2]]
    this.reversed=(cardValue[3]==="-")
    this.symbolic=data[this.name][this.reversed?"reversed":"upright"]
    this.displayName=data[this.name]["name"]+", "+(this.reversed?"Reversed":"Upright")
  }
}
//'<img width="71" height="95" src=""'+tarotData[results[i-1].name]["link"]+'" style="transform: scaleY('+results[i-1].reversed?"-1":"1"+')">'
function displayWeb(results){
  let EVIL='<div style="display:inline-block; width:71px; height:95px;"></div>'
  let map=[EVIL]
  for (let i of results){
    map.push('<img width="71" height="95" src="'+data[i.name]["link"]+'" style="transform: scaleY('+(i.reversed?"-1":"1")+') scaleX('+(i.reversed?"-1":"1")+')">')
  }
  let spreadLocations=SPREADS[SPREAD]["positionMatrix"]
  let htmlString=""
  for (let i of spreadLocations){
    let row=""
    for (let j of i){
      row+=map[j]
    }
    row+="<br>"
    htmlString+=row
  }
  const SPREADDATA=SPREADS[SPREAD]
  let outString="======Your Cards:======<br>"
  for (let i=1;i<=CARDSDRAWN;i++){
    outString+=(unspecified?"Position "+i:SPREADDATA["positionMeaning"][i])+": <b>"+results[i-1].displayName
    outString+="</b><br>"
    outString+=(MOREINFO)?("\u2514\u2574Meanings: "+results[i-1].symbolic+"<br>"):""
  }
  htmlString+=outString
  let display=new WebView()
  display.loadHTML(htmlString)
  display.present(true)
}
function displayText(results){
  const SPREADDATA=SPREADS[SPREAD]
  let outString="\n======Your Cards:======\n"
  for (let i=1;i<=CARDSDRAWN;i++){
    outString+=(unspecified?"Position "+i:SPREADDATA["positionMeaning"][i])+": "+results[i-1].displayName
    outString+="\n"
    outString+=(MOREINFO)?("\u2514\u2574Meanings: "+results[i-1].symbolic+"\n"):""
  }
  log(outString)
}
function main(){
  //great security
  let deck=eval("init"+(SELECTION[0].toUpperCase()+(SELECTION.slice(1))+"()"))
  let results=draw(deck,CARDSDRAWN)
  if (WEBVIEW&&(!unspecified)){displayWeb(results)}else{displayText(results)}
}
main()
