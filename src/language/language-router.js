const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

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
      console.log(head)
      res.json({
        nextWord: head[0].next,
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
    /* 
      compare user guess to correct translation
      craft json response

    */
    const { userGuess } = req.body 
    const db = req.app.get('db')
    const userId = req.user.id
    try {

      const head = await LanguageService.getLanuageHead(
        db,
        userId
      )
      const correctAnswer = head[0].translation
      
      let totalScore = head[0].total_score
      let wordCorrectCount = head[0].correct_count
      let wordIncorrectCount = head[0].incorrect_count
      let wordId = head[0].id
      let checkAnswer;

      //userGuess = userGuess.toLowerCase().trim()
      if (userGuess === correctAnswer) {
        // Update database to correct values for score tracking
        LanguageService.updateWordCorrectCount(db, wordId, userId, wordCorrectCount)
        LanguageService.updateTotalScore(db, userId,totalScore)
        checkAnswer = true
        // instead of re-querying databse for updated values we can
        // itterate by 1 and pass that in to the expected json response
        wordCorrectCount++
        totalScore++
      }
      else {
        // if user answers wrong, itterate +1 to incorrect answers
        LanguageService.updateIncorrectCount(db, req.user.id, wordIncorrectCount)
        wordIncorrectCount++
        checkAnswer = false;
      }

      res.json({
        nextWord: head[0].next,
        totalScore, // post and add 1 to score
        wordCorrectCount, // if correct post add 1 here
        wordIncorrectCount, // if incorrect post add 1 here
        answer: head[0].translation,
        isCorrect: checkAnswer
      })
      
    } catch (error) {
      next(error)
    }

  })

module.exports = languageRouter
