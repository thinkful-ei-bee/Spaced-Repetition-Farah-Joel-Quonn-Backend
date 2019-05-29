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

  // getLanuageHeadHelper(db, user_id) {
  //   return db
  //   .from('language')
  //   .select(
  //     'head'
  //   )
  //   .where({
  //     user_id
  //   })
  // },

  getLanuageHead(db, user_id) {
    return db
      .from('language')
      // .join('word', 'language.id', '=', 'word.language_id')
      .join('word', {
        'language.id': 'word.language_id',
        'word.id': 'language.head'
      })
      .select(
        'word.id',
        'word.original',
        'word.translation',
        'word.memory_value',
        'word.correct_count',
        'word.incorrect_count',
        'word.language_id',
        'word.next',
        'language.total_score',
        // 'language.head'
      )
      .where({ 
        user_id,
        // 'word.id': 'head'
      })
      // .where(
      //   'word.id', 'language.head'
      // )
  },
  updateWordCorrectCount(db, word_id, user_id, currentCorrectCount) {
    let newCount = currentCorrectCount + 1
    return db('word')
      .update({
        correct_count: newCount
      })
      .where({
        id: word_id,
        language_id: user_id
      })
  },
  updateWordIncorrectCount(db, word_id, user_id, currentIncorrectCount) {
    let newCount = currentIncorrectCount + 1
    return db('word')
      .update({
        incorrect_count: newCount
      })
      .where({
        id: word_id,
        language_id: user_id
      })
  },
  updateTotalScore(db, user_id, currentTotalScore) {    
    let newScore = currentTotalScore + 1
    return db('language')
      .update({
        total_score: newScore
      })
      .where({
        id: user_id
      })
  }
}

module.exports = LanguageService
