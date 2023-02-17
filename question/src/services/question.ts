import { createError } from '../util.js';
import { questionBody } from '../defineConfig.js'
import { questions as questionDb } from '../database/mongoDb.js'
import { questionTypes, availableLanguages } from '../questionConfig.js'

export const addQuestion = async (data: questionBody) => {

    try {
        const questionTypesKeys = Object.keys(questionTypes)
        const availableLanguagesKeys = Object.keys(availableLanguages)

        try {
            //VALIDATION
            if (!data.question) throw "Question is required"
            if (!data.title) throw "Title is required"
            if (!data.language) throw "Language is required"
            if (!data.type) throw "Type is required"
            if (!availableLanguagesKeys.includes(data.language.trim().toUpperCase())) throw "Language isn't specified"
            if (!questionTypesKeys.includes(data.type.trim().toUpperCase())) throw "Invalid type"
            if (!data.answer || data.answer.length === 0) throw "Answer is required"
            if (!data.category || data.category.length === 0) throw "Category is required"

            data.question = data.question.trim();
            data.title = data.title.trim();
            data.language = data.language.trim().toUpperCase();
            data.type = data.type.trim().toUpperCase();

        } catch (error) {
            throw createError(406, typeof error === "string" ? error : "Data not valid")
        }

        try {
            //CHECKING OPTIONS AND ANSWERS IN EACH TYPE
            switch (data.type) {
                case "MC": {
                    let i = 0
                    let optionObj = {}
                    if (!data.options || data.options.length < 4) throw `${questionTypes["MC"]} should need four option`;
                    while (i < data.options.length) {
                        if (data.options[i].trim() === '') throw `Option ${i + 1} cannot be empty`
                        optionObj[data.options[i].trim()] = data.options[i].trim()
                        i++
                    }
                    const optionObjLen = Object.keys(optionObj)
                    if (optionObjLen.length != data.options.length) throw 'Option contains duplicate'
                    if (data.answer.length < 2) throw `${questionTypes['MC']} should contain more than 1 answer`
                    if (Number(data.score) !== 2) throw `${questionTypes['MC']} should be 2 marks`
                    break;
                }

                case "SC": {
                    let i = 0
                    let optionObj = {}
                    if (!data.options || data.options.length < 4) throw `${questionTypes["SC"]} should need four option`
                    while (i < data.options.length) {
                        if (data.options[i].trim() === '') throw `Option ${i + 1} cannot be empty`
                        optionObj[data.options[i].trim()] = data.options[i].trim()
                        i++
                    }
                    const optionObjLen = Object.keys(optionObj)
                    if (optionObjLen.length != data.options.length) throw 'Option contains duplicate'
                    if (data.answer.length !== 1) throw `${questionTypes['SC']} shouldn't contain more than 1 answer`
                    if (Number(data.score) !== 1) throw `${questionTypes['SC']} should be 1 mark`
                    break;
                }

                case "YN": {
                    let i = 0
                    let optionObj = {}
                    if (!data.options || data.options.length !== 2) throw `${questionTypes["YN"]} should need 2 options`
                    while (i < data.options.length) {
                        if (data.options[i].trim() === '') throw `Option ${i + 1} cannot be empty`
                        optionObj[data.options[i].trim()] = data.options[i].trim()
                        i++
                    }
                    const optionObjLen = Object.keys(optionObj)
                    if (optionObjLen.length != data.options.length) throw 'Option contains duplicate'
                    if (data.answer.length !== 1) throw `${questionTypes['YN']} shouldn't contain more than 1 answer`
                    if (Number(data.score) !== 1) throw `${questionTypes['YN']} should be 1 mark`
                    break;
                }
            }
        } catch (error) {
            throw createError(406, typeof error === "string" ? error : "Options are required")
        }

        try {
            // Search for a question with the same text
            const existingQuestion = await questionDb.findOne({ $and: [{ question: data.question }, { language: data.language }] });
            if (existingQuestion) throw createError(406, "A similar question already exists in the database.");
            // Create a new question and save it to the database
            const newQuestion = new questionDb(data);
            await newQuestion.save();
            return 'Saved successfully';
        } catch (error) {
            throw error;
        }

    } catch (error) {
        throw error
    }
}

//Test function instead of API
const test = async () => {
    try {
        let obj: questionBody = {
            question: 'asdfdsak',
            title: 'asedfsdf',
            code: '',
            score: '1',
            tags: [],
            language: 'JS',
            type: 'YN',
            answer: ['asdfd'],
            category: ['easy'],
            options: ['a', 'q'],
            addedBy: 'admin'
        }

        const data = await addQuestion(obj)
        console.log(data);

    } catch (error) {
        console.log('errr', error);
    }
}

// test()