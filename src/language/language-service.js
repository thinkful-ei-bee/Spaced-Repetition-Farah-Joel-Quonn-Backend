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
      // .join('word', {
      //   'language.id': 'word.language_id',
      //   'word.id': 'language.head'
      // })
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
  },

  updateMemoryValue(db, word_id, user_id, currentMemoryValue, listTotal) {
    let newMemoryValue

    // address out of range for smallint error
    // also for sanity, keep memory value within
    // a reasonable range

    console.log(`currentMemoryValue: ${currentMemoryValue} listTotal: ${listTotal}`)
    if (currentMemoryValue <= listTotal) {
      newMemoryValue = currentMemoryValue * 2
    }
    else {
      newMemoryValue = listTotal
    }
    console.log(`currentMemoryValue: ${currentMemoryValue} listTotal: ${listTotal}`)

    return db('word')
      .update({
        memory_value: newMemoryValue
      })
      .where({
        id: word_id,
        language_id: user_id
      })
  }, 

  resetMemoryValue(db, word_id, user_id) {
    return db('word')
      .update({
        memory_value: 1
      })
      .where({
        id: word_id,
        language_id: user_id
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
      await LanguageService.updateLanguageWord(db,currNode.data);
      currNode = currNode.next;
    }
    return;
  },

}

module.exports = LanguageService
