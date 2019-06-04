const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser= express.json()
const languageRouter = express.Router()

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
    
    const db = req.app.get('db')
    const userId = req.user.id

    let word = await LanguageService.getLanguageHead(
      db, 
      userId,
    )
    
    let totalScore = await LanguageService.getTotalScore(
      db,
      userId
    );

    word = word[0];
    totalScore = totalScore[0];

      const head = {
        nextWord: word.original,
        wordCorrectCount: word.correct_count,
        wordIncorrectCount: word.incorrect_count,
        totalScore: Number(totalScore.total_score)
    }

    return res.status(200).json(head);
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {

    let guess = req.body.guess

    const db = req.app.get('db')
    const userId = req.user.id

    try {
      if (!guess) {     
        return res.status(400).send({error: `Missing 'guess' in request body`});
      }

    let head = await LanguageService.getLanguageHead(
        db, 
        req.language.id,
    )

      head = await head;
      head = head[0];

     let totalScore = await LanguageService.getScore(
        db,
        req.user.id
       );
      totalScore = await totalScore;
      totalScore = totalScore[0].total_score
  
       
    let resObj = {
      answer: head.translation
    }  

    if(guess === head.translation){  
        
      resObj.isCorrect=true
      resObj.totalScore= totalScore += 1;

      head.memory_value *= 2;
      head.correct_count += 1;

    } else{
      resObj.isCorrect=false;
      resObj.totalScore = totalScore;

      head.memory_value = 1;
      head.incorrect_count += 1;
    }

    let nextHead= head.next;

    let prevWord = head;
    
    for (let i = 0; i < head.memory_value; i++) {
      if (!prevWord.next) {
        break;
      }

      prevWord = await LanguageService.getWordById(
        db,
        prevWord.next
      );
      prevWord = prevWord[0];
    }
    head.next = prevWord.next;
    prevWord.next = head.id;
    
    await LanguageService.updateWord(
      db,
      head.id,
      {
        memory_value : head.memory_value,
        correct_count: head.correct_count,
        incorrect_count:head.incorrect_count,
        next: head.next
      }
    );
    await LanguageService.updateWord(
      db,
      prevWord.id,
      {
        next: head.id,
      }
    )

      await LanguageService.updateLanguage(
        db,
        req.user.id,
        {
          total_score:Number(resObj.totalScore),
          head:nextHead
        }
      );


      let newHead = await LanguageService.getLanguageHead(
        db,
        req.user.id
      )
      newHead= await newHead
      
      newHead = newHead[0]

       response = {
        nextWord:newHead.original,
        wordCorrectCount:newHead.correct_count,
        wordIncorrectCount:newHead.incorrect_count,
        answer:resObj.answer,
        isCorrect:resObj.isCorrect,
        totalScore:Number(resObj.totalScore),
      }

       res.status(200).json(response)
       
       next()
      } catch (error) {
        next(error)
      }
    })

module.exports = languageRouter
