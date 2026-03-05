export class FlashcardService {
  // Thuật toán xáo trộn Fisher-Yates chuyên nghiệp
  shuffleCards(cards: any[]) {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Tính điểm theo tỷ lệ phần trăm
  calculateFinalScore(correct: number, total: number): number {
    return total > 0 ? (correct / total) * 100 : 0;
  }
}
