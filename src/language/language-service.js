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

  /*
  get user lanuage based on user id in language
    'head' is where user current is
  select/join word based on language_id in word
    return data
  */
  getLanuageHead(db, user_id, current_word) {
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
        'word.next'
      )
      .where({ user_id })
  }
}

module.exports = LanguageService
