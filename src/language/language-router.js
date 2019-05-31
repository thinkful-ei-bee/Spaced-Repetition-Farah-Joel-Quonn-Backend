const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

const LanguageListService = require('./language-list-service')
const LinkedList = require('../linked-list')

let list = new LinkedList
//list = LanguageListService.buildList(list)
// console.log(list)
//LanguageListService.display(list)

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
      
      const resObj = {
        // nextWord: head[0].next,
        nextWord: head[0].original,
        totalScore: head[0].total_score,
        wordCorrectCount: head[0].correct_count,
        wordIncorrectCount: head[0].incorrect_count,
      }

      res.json(resObj)
      next()
    } catch (error) {
      next(error)
    }  
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {

    const { guess } = req.body 
    const resObj = {}
    const db = req.app.get('db')
    const userId = req.user.id
    // If list not built yet, grab words and build list
    if(list.head === null) {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      LanguageListService.buildList(list, words)
    }
    //console.log('list: ')
    LanguageListService.display(list)

    try {

      let head = await LanguageService.getLanuageHead(
        db,
        userId
      )
     console.log('head', head)
     head = await head;

      const words = await LanguageService.getLanguageWords(
        db,
        head[0].language_id
      )

      //console.log('words', words)
      const nextHead = words.filter(word => word.id === head[0].next);
     // console.log('nexthead', nextHead)

      const correctAnswer = head[0].translation
      
      let totalScore = head[0].total_score
      let wordCorrectCount = head[0].correct_count
      let wordIncorrectCount = head[0].incorrect_count
      let wordId = head[0].id
      let wordMemoryValue = head[0].memory_value
      let listCount = LanguageListService.getTotal(list)
      let checkAnswer;

      //userGuess = userGuess.toLowerCase().trim()
      if (guess === correctAnswer) {
        // Update database to correct values for score tracking
        await LanguageService.updateWordCorrectCount(db, wordId, userId, wordCorrectCount)
        await LanguageService.updateTotalScore(db, userId, totalScore)
        await LanguageService.updateMemoryValue(db, wordId, userId, wordMemoryValue, listCount)
        // instead of re-querying databse for updated values we can
        // itterate by 1 and pass that in to the expected json response
        wordCorrectCount++
        totalScore++
        checkAnswer = true
      }
      else {
        // if user answers wrong, itterate +1 to incorrect answers
        await LanguageService.updateWordIncorrectCount(db, wordId, userId, wordIncorrectCount)
        await LanguageService.resetMemoryValue(db, wordId, userId, wordMemoryValue)
        wordIncorrectCount++
        checkAnswer = false;
      }

      console.log('heads:', head[0].next)
     // console.log('words', words)
    //  console.log('newHead', head)
      let newHead = head[0].next
      let curWord = head[0];

      curWord = curWord[0];
   //   console.log('curWord', curWord)

      curWord = await LanguageService.getWordFromId(
        req.app.get('db'),
        head[0].next
      );
      curWord = curWord[0];
      console.log('Current word is', curWord.original);
      console.log('next will be ', curWord.next);
    
      await LanguageService.updateWord(
        req.app.get('db'),
        curWord.id,
        {next: curWord.next, 
          wordMemoryValue: curWord.wordMemoryValue,
          wordCorrectCount: curWord.wordCorrectCount,
          wordIncorrectCount: curWord.wordIncorrectCount
        }
      );
      
      await LanguageService.updateWord(
        req.app.get('db'),
        curWord.id,
        {next: curWord.id},
        console.log(head[0].id),
        console.log(curWord.id)
      );


      await LanguageService.updateLanguage(
        req.app.get('db'), 
        req.language.id, 
        {
          head: newHead,
        //  totalScore: Number(score.totalscore)
        }
      );
      
      let nextWord = await LanguageService.getLanuageHead(
        req.app.get('db'),
        req.user.id
      );
  
      nextWord = nextWord[0];

      resObj.nextWord = nextWord.original;
      resObj.wordCorrectCount = nextWord.correct_count;
      resObj.wordIncorrectCount = nextWord.incorrect_count;
      resObj.answer = nextWord.translation;
      //resObj.totalScore = Number(score.totalscore);

      // res.json({
      //   nextWord: curWord.original, 
      //   totalScore, // post and add 1 to score
      //   wordCorrectCount, // if correct post add 1 here
      //   wordIncorrectCount, // if incorrect post add 1 here
      //   answer: curWord.translation,
      //   isCorrect: checkAnswer
      // }) 

      res.json({
        nextWord: resObj.nextWord,
        totalScore: resObj.totalScore,
        wordCorrectCount: resObj.wordCorrectCount,
        wordIncorrectCount: resObj.wordIncorrectCount,
        answer: resObj.answer,
        isCorrect: resObj.isCorrect
      })
    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter
