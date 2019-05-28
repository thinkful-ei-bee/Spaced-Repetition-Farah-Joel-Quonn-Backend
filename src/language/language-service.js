const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  getLanuageHead(db, user_id) {
    return db
      .from('language')
      .join('word', 'language.id', '=', 'word.language_id')
      .select(
        'word.id',
        'word.original',
        'word.translation',
        'word.memory_value',
        'word.correct_count',
        'word.incorrect_count',
        'word.language_id',
        'word.next',
        'language.total_score'
      )
      .where({ user_id })
  },
  updateWordCorrectCount(db, word_id, user_id, currentCorrectCount) {
    let newCount = currentCorrectCount++;
    return db('word')
      .update({
        correct_count: 1
      })
      .where({
        id: word_id,
        language_id: user_id
      })
  },
  updateWordIncorrectCount(db, user_id, currentIncorrectCount) {
    console.log(currentIncorrectCount)
  },
  updateTotalScore(db, user_id, currentTotalScore) {
    console.log(currentTotalScore)
  }
}

module.exports = LanguageService
