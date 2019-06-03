const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const languageRouter = express.Router()
const jsonBodyParser = express.json()
const LanguageListService = require('./language-list-service')
const LinkedList = require('../linked-list')
const { displayList, size, isEmpty, findPrevious, findLast, remove, insertFirst, insertAt, insertBefore, insertLast } = require('../linked-list-helpers')
//let list = new LinkedList

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const head = await LanguageService.getLanuageHead(
        req.app.get('db'),
        req.user.id
      )

      const db = req.app.get('db')

      const words = await LanguageService.getLanguageWords(
        db,
        req.language.id
      )

      let list = await LanguageListService.buildList(words, req.language)

      res.json({
        nextWord: head[0].original,
        totalScore: head[0].total_score,
        wordCorrectCount: head[0].correct_count,
        wordIncorrectCount: head[0].incorrect_count,
      })

      next()
    } catch (error) {
      next(error)
    }

  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    const { guess } = req.body

    const db = req.app.get('db')

    const userId = req.user.id

    let guessResObj = {}

    let list;

    try {
      // const head = await LanguageService.getLanuageHead(
      //   db,
      //   userId
      // )

      const words = await LanguageService.getLanguageWords(
        db,
        req.language.id
      )

      console.log('words', words)
      list = await LanguageListService.buildList(words, req.language)
      let head = list.head

      let word = head.value  
      console.log('word:', word)    
    
      const correctAnswer = head.value.translation
      let totalScore = head.value.total_score //???

      let wordCorrectCount = head.value.correct_count
      let wordIncorrectCount = head.value.incorrect_count
      let wordId = head.value.id
      let wordMemoryValue = head.value.memory_value
      let listCount = LanguageListService.getTotal(list) 
      let checkAnswer;

    
      if (guess === correctAnswer) {
        wordMemoryValue *= 2;
        wordCorrectCount += 1;
        totalScore += 1;
        checkAnswer = true
      }
      else {
        wordMemoryValue = 1;
        wordIncorrectCount += 1;
        checkAnswer = false;
      }
      list.remove(head.value);
      list.insertAt(head.value, head.value.memory_value + 1);


      await LanguageService.updateLanguageWords(
        db,
        list,
        req.language.id,
        req.language.total_score
      )

      const nextWord = list.head.value;

    //   let newHead = word.next; // list.head.value.next
    //   let currentWord = word; // list.head.value

    //   for (let i = 0; i < word.memory_value; i++) {
    //     if (!currentWord.next) {
    //       break;
    //     }



    //   currentWord = await LanguageService.getWordFromId(
    //     req.app.get('db'),
    //     currentWord.next
    //   );
    //   currentWord = currentWord[0];
    //  console.log('current word', currentWord)
    // }

    //   word.next = currentWord.next;
    //   currentWord.next = word.id;

    //   await LanguageService.updateWord(
    //     req.app.get('db'),
    //     word.id,
    //     {
    //       next: word.next,
    //     //  answer: word.translation,
    //       memory_value: word.memory_value,
    //       correct_count: word.correct_count,
    //       incorrect_count: word.incorrect_count
    //     }
    //   );

      console.log('next word', nextWord)
      guessResObj = ({
        nextWord: nextWord.original,
        totalScore, // post and add 1 to score
        wordCorrectCount, // if correct post add 1 here
        wordIncorrectCount, // if incorrect post add 1 here
        answer: word.translation,
        isCorrect: checkAnswer
      })
    }
    catch (error) {
      next(error)
    }
    res.send(JSON.stringify(guessResObj))
  })

module.exports = languageRouter