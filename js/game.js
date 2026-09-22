// Pure game rules: kept separate from the interface for repeatable testing.
export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export class Game {
  constructor(animals, random = Math.random) {
    if (animals.length < 4 || new Set(animals.map(a => a.id)).size !== animals.length) throw new Error('At least four unique animals are required.');
    this.animals = animals; this.random = random; this.restart();
  }
  restart() { this.order = shuffle(this.animals, this.random); this.index = 0; this.score = 0; this.results = []; this.selected = null; this.setChoices(); }
  get current() { return this.order[this.index]; }
  setChoices() {
    this.choices = shuffle([this.current, ...shuffle(this.animals.filter(a => a.id !== this.current.id), this.random).slice(0, 3)], this.random);
  }
  answer(id) {
    if (this.selected !== null || !this.choices.some(a => a.id === id)) return false;
    this.selected = id;
    const correct = id === this.current.id;
    if (correct) this.score++;
    this.results.push({ id: this.current.id, selected: id, correct });
    return true;
  }
  next() {
    if (this.selected === null) return false;
    if (this.index === this.order.length - 1) return 'finished';
    this.index++; this.selected = null; this.setChoices(); return true;
  }
}
