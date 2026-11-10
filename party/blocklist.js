// ── Science Bowl Online Arena — Blocked words ─────────────────────────────────
//
// Names other people see (callsigns, public room names) are checked against
// this list. It catches common swears and slurs, including l33t spellings
// (5H1T), stretched letters (FUUUCK) and spaced-out letters (F U C K).
//
// Two kinds of entries:
//   ANYWHERE — blocked even inside a longer word. Only words that don't show
//              up inside normal words belong here.
//   WHOLE    — blocked only as a word on its own, because they hide inside
//              innocent words (ASS in CLASS, HELL in HELLO, SEX in SEXTANT,
//              CUM in CUMULUS, RETARD in FLAME RETARDANT).

const ANYWHERE = [
  'fuck', 'fck', 'shit', 'bitch', 'cunt', 'whore', 'slut', 'bastard',
  'asshole', 'dumbass', 'jackass', 'motherf', 'nigg', 'faggot', 'fagot',
  'retarded', 'twat', 'piss', 'pussy', 'penis', 'vagina', 'porn', 'boob',
  'blowjob', 'handjob', 'dildo', 'hitler', 'nazi', 'killyourself', 'molest',
];

const WHOLE = [
  'ass', 'asses', 'arse', 'hell', 'damn', 'dick', 'dicks', 'cock', 'cocks',
  'tit', 'tits', 'titty', 'sex', 'sexy', 'cum', 'rape', 'raped', 'rapist',
  'retard', 'retards', 'fag', 'fags', 'fuk', 'kys', 'kkk', 'thot', 'hoe',
  'hoes', 'crap', 'bollocks', 'wtf', 'stfu', 'gtfo', 'milf', 'nude', 'nudes',
  'wank', 'pedo', 'pedos', 'tranny', 'chink', 'spic', 'kike',
];

// Numbers and symbols people swap in for letters.
const LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b',
               '@': 'a', '$': 's', '!': 'i', '|': 'i' };

// "fuck" -> /f+u+c+k+/ so stretched spellings still match, while a double
// letter in the word itself (boob) still needs both letters.
const stretchy = w => w.split('').map(c => c + '+').join('');
const ANYWHERE_RE = new RegExp(ANYWHERE.map(stretchy).join('|'));
const WHOLE_RE    = new RegExp(`^(?:${WHOLE.map(stretchy).join('|')})$`);

export function hasBlockedWord(text) {
  const lower = String(text || '').toLowerCase().replace(/[0-9@$!|]/g, c => LEET[c] || c);
  // Glue runs of single letters back together, so "f u c k" and "f.u.c.k" are
  // read as one word — without gluing real words ("push it") into a swear.
  const words = [];
  for (const w of lower.split(/[^a-z]+/).filter(Boolean)) {
    const prev = words[words.length - 1];
    if (w.length === 1 && prev && prev.single) prev.text += w;
    else words.push({ text: w, single: w.length === 1 });
  }
  return words.some(({ text }) => ANYWHERE_RE.test(text) || WHOLE_RE.test(text));
}
