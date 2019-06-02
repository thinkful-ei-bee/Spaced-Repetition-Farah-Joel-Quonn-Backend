const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const languageRouter = express.Router()
const jsonBodyParser = express.json()
const LanguageListService = require('./language-list-service')
const LinkedList = require('../linked-list')

let list = new LinkedList

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
    let nextWord = await LanguageService.getLanuageHead(req.app.get('db'), req.user.id);
    //console.log(nextWord)

    try {
      const head = await LanguageService.getLanuageHead(
        db,
        userId
      )

      const words = await LanguageService.getLanguageWords(
        db,
        head[0].language_id
      )

      LanguageListService.buildList(list, words)
      
      let word = list.head.value
      const correctAnswer = word.translation

      let totalScore = head[0].total_score //???

      let wordCorrectCount = word.correct_count
      let wordIncorrectCount = word.incorrect_count
      let wordId = word.id
      let wordMemoryValue = word.memory_value
      let listCount = LanguageListService.getTotal(list) 
      let checkAnswer;

    
      if (guess === correctAnswer) {
        // update db with values returned from promise
        // await LanguageService.updateWordCorrectCount(db, wordId, userId, wordCorrectCount)
        // await LanguageService.updateTotalScore(db, userId, totalScore)
        // await LanguageService.updateMemoryValue(db, wordId, userId, wordMemoryValue, listCount)
        wordMemoryValue *= 2;
        wordCorrectCount += 1;
        totalScore += 1;
        checkAnswer = true
       // list.head = list.head.next
      }
      else {
        // if user answers wrong, itterate +1 to incorrect answers
        // await LanguageService.updateWordIncorrectCount(db, wordId, userId, wordIncorrectCount)
        // await LanguageService.resetMemoryValue(db, wordId, userId, wordMemoryValue)
        wordMemoryValue = 1;
        wordIncorrectCount += 1;
        checkAnswer = false;
        list.head = list.head.next
      }

      let newHead = word.next; // list.head.value.next
      let currentWord = word; // list.head.value

      for (let i = 0; i < word.memory_value; i++) {
        if (!currentWord.next) {
          break;
        }



      currentWord = await LanguageService.getWordFromId(
        req.app.get('db'),
        currentWord.next
      );
      currentWord = currentWord[0];
     // console.log('current word', currentWord.original)
    }

      word.next = currentWord.next;
      currentWord.next = word.id;

      await LanguageService.updateWord(
        req.app.get('db'),
        word.id,
        {
          next: word.next,
        //  answer: word.translation,
          memory_value: word.memory_value,
          correct_count: word.correct_count,
          incorrect_count: word.incorrect_count
        }
      );

      console.log('next word', nextWord)
      guessResObj = ({
        nextWord: newHead,
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