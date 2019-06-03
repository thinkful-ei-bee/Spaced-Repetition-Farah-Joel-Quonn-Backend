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
      .orderBy('next', 'ascending')
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
        'language.total_score',
      )
      .where({ 
        user_id,
      })
  },

  getNextWord(db, user_id) {
    return db
      .from('word')
      .select(
        'original',
        'translation',
        'correct_count',
        'incorrect_count',
        'language_id'
      )
      .join('language_id', 'language', '=', 'word.language_id' )
      .where('word_id', db.raw('language.head'))
      .andWhere({ 'language_id': user_id});
  },

  getWordFromId(db, id) {
    return db 
    .from('word')
    .select('*')
    .where( {'word_id': id}  );
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
  },

  getWordFromId(db, id) {
    return db 
      .from('word')
      .select('*')
      .where({ id });
  },

  updateWord(db, id, word) {
    return db
    .from('word')
    .where({ id })
    .update(word) 
  },

  updateLanguage(db, id, obj) {
    return db
    .from('language')
    .where({id})
    .update({
      head: obj.head, 
      total_score: obj.total_score
    });
  },
  async updateLanguageWords(db,listOfWords){
    // linked list of words
    let currNode = listOfWords.head;
    let nextId = null
    while(currNode !== null){
      await LanguageService.updateLanguageWord(db,currNode.value);
      currNode = currNode.next;
    }
    return;
  },
  updateLanguageWord(db,word){
    return db
      .from('word')
      .select('*')
      .where({'id':word.id})
      .update(word)
  },
}

module.exports = LanguageService
