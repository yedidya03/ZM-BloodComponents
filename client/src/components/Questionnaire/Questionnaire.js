import React, { useState, useEffect, Fragment } from "react";
import "./Questionnaire.css";
import { useHistory } from "react-router-dom";
import Button from "../button";
import { db } from "../firebase/firebase";
import { useTranslation } from "react-i18next";
import qIcon from "./questionnaire.svg";

const HOSPITALS = ['Ichilov', 'Tel HaShomer', 'Hadassah', 'Rambam', 'Beilinsohn', 'Soroka']

export default function Questionnaire() {
  const { t } = useTranslation();

  let history = useHistory();
  //Set results of the questionarre into state from the drop downs
  const [result, setResults] = useState({
    Q1: `${t("questionnaire.select")}`,
    Q2: `${t("questionnaire.select")}`,
    Q3: `${t("questionnaire.select")}`,
    Q4: `${t("questionnaire.select")}`,
    Q5: `${t("questionnaire.select")}`,
    Q6: `${t("questionnaire.select")}`,
    Q7: `${t("questionnaire.select")}`,
    Q8: `${t("questionnaire.select")}`,
    Q9: `${t("questionnaire.select")}`,
    Q10: `${t("questionnaire.select")}`,
    Q11: `${t("questionnaire.select")}`,
    Q12: `${t("questionnaire.select")}`,
    Q13: `${t("questionnaire.select")}`,
    Q14: `${t("questionnaire.select")}`,
    Q15: `${t("questionnaire.select")}`,
    Q16: `${t("questionnaire.select")}`,
    Q17: `${t("questionnaire.select")}`,
  });

  let checkedAnswers = [];
  //allow submit only when all questions have been submit TODO:
  const [complete, setComplete] = useState(false);

  const [hospital, setHospital] = useState();
  const [gender, setGender] = useState();

  let languageSelected = localStorage.getItem("i18nextLng");

  //questionare questions and options, in english
  const questionList = [
    {
      id: 1,
      question: "Have you ever donated blood or Thrombocytes?",
      options: ["Yes", "No"],
      condition: { hospitals: ['Beilinsohn'], invalidSelection: ['No'] }
    },
    {
      id: 2, question: `Is your weight above ${hospital != 'Ichilov' ? "50kg?" : "55kg"}`, options: ["Yes", "No"],
      condition: { hospitals: hospital != 'Ichilov' ? [...HOSPITALS] : ['Ichilov'], invalidSelection: ['No'] }
    },
    {
      id: 3,
      question: "Did you do a tattoo/earrings/piercing in the last 6 months?",
      options: ["Yes", "No"],
      condition: { hospitals: [...HOSPITALS], invalidSelection: ['No'] }
    },
    {
      id: 4,
      question: "Do you have diabetes",
      options: [
        "Yes, but stable treated by medicines",
        "Yes, but not stable or treated with Insulin",
        "No",
      ],
      condition: { hospitals: [...HOSPITALS], invalidSelection: ['Yes, but not stable or treated with Insulin'] }
    },
    {
      id: 5, question: "Do you take medicines?", options: ["Yes", "No"],
      condition: { hospitals: [...HOSPITALS], invalidSelection: ['No'] }
    },
    {
      id: 6,
      question: "Have you been abroad in the last year?",
      options: ["Yes", "No"],
      condition: { hospitals: [...HOSPITALS], invalidSelection: ['No'] }
    },
    {
      id: 7,
      question: "Have you gone through a medical surgery in the last month?",
      options: ["Yes", "No"],
      condition: { hospitals: [...HOSPITALS], invalidSelection: ['No'] }
    },
    {
      id: 8,
      question: "Do you suffer from a Chronic disease?",
      options: ["Yes", "No"],
      condition: { hospitals: [...HOSPITALS], invalidSelection: ['No'] }
    },
    {
      id: 9,
      question: "Have you ever suffered from cancer?",
      options: ["Yes", "No"],
      condition: { hospitals: [...HOSPITALS], invalidSelection: ['No'] }
    },
    {
      id: 10,
      question: "Did you take antibiotics in the last 3 days?",
      options: ["Yes", "No"],
      condition: { hospitals: [...HOSPITALS], invalidSelection: ['No'] }
    },
    {
      id: 11,
      question: "Have you gone through Dentist procedure in the last 10 days?",
      options: ["Yes", "No"],
      condition: { hospitals: [...HOSPITALS], invalidSelection: ['No'] }
    },
    {
      id: 12,
      question: "Do you have an open wound or a scratch?",
      options: ["Yes", "No"],
      condition: { hospitals: ['Beilinsohn'], invalidSelection: ['No'] }
    },
    {
      id: 13,
      question: `Do you confirm your age is between ${hospital != 'Ichilov' ? "17 and 65?" : "18 and 62?"}`,
      options: ["Yes", "No"],
      condition: { hospitals: hospital != 'Ichilov' ? [...HOSPITALS] : ['Ichilov'], invalidSelection: ['No'] }
    },
    {
      id: 14,
      question: `${hospital != 'Beilinsohn' ? "Have you ever been pregnant?" : "Have you been pregnant in the last 6 months?"}`,
      options: ["Yes", "No"],
      condition: { hospitals: hospital != 'Beilinsohn' ? [...HOSPITALS] :['Beilinsohn'], invalidSelection: ['No'] }
    },
    {
      id: 15,
      question: "When was your last donation?",
      options: [
        "Over one month ago",
        "Less than one month, more than 10 days ago",
        "Less than 10 days ago",
        "Never",
      ],
      condition: { hospitals: ['Beilinsohn'], invalidSelection: ['Never'] }
    },
    {
      id: 16,
      question: "Reading and truth statement confirmation",
      options: ["Confirm", "Dont confirm"],
      condition: { hospitals: [...HOSPITALS], invalidSelection: ['Dont confirm'] }
    },
  ];
  console.log("Questionnaire -> questionList", questionList)

  const questionListHeb = [
    { id: 1, question: "?האם תרמת טרומבוציטים בעבר", options: ["כן", "לא"] },
    { id: 2, question: 'האם משקלך מעל 55 ק"ג', options: ["כן", "לא"] },
    { id: 3, question: 'האם משקלך מעל 50 ק"ג', options: ["כן", "לא"] },
    {
      id: 4,
      question: "האם עשית קעקוע/עגיל בחצי שנה האחרונה",
      options: ["כן", "לא"],
    },
    {
      id: 5,
      question: "האם יש לך סכרת",
      options: [
        'כן, יציב, ומטופל ע"י תרופות',
        'כן, לא יציב, ומטופל ע"י סכרת',
        "לא",
      ],
    },
    { id: 6, question: "האם הינך נוטל תרופות?", options: ["כן", "לא"] },
    { id: 7, question: 'האם היית בחו"ל בשנה האחרונה', options: ["כן", "לא"] },
    { id: 8, question: "האם עברת ניתוח בחודש האחרון?", options: ["כן", "לא"] },
    { id: 9, question: "האם יש לך מחלה כרונית?", options: ["כן", "לא"] },
    {
      id: 10,
      question: "האם הנך או היית בעבר חולה במחלת הסרטן",
      options: ["כן", "לא"],
    },
    {
      id: 11,
      question: "האם נטלת אנטיביוטיקה בשלושת הימים האחרונים?",
      options: ["כן", "לא"],
    },
    {
      id: 12,
      question: "האם עברת טיפול אצל רופא שיניים בעשרת הימים האחרונים?",
      options: ["כן", "לא"],
    },
    { id: 13, question: "האם יש לך פצע פתוח או שריטה?", options: ["כן", "לא"] },
    { id: 14, question: "האם אתה בטווח הגילאים 17-65?", options: ["כן", "לא"] },
    {
      id: 15,
      question: "האם היית בהריון במהלך החצי שנה האחרונה?",
      options: ["כן", "לא"],
    },
    {
      id: 16,
      question: "מתי בפעם האחרונה תרמת טרומבוציטים?",
      options: [
        "לפני יותר מחודש",
        "בין עשרה ימים לחודש.",
        "פחות מעשרה ימים",
        "לעולם לא",
      ],
    },
    {
      id: 17,
      question: "הצהרה שכל האמור לעיל הינו אמת",
      options: ["מצהיר ומאשר", "לא מאשר"],
    },
  ];

  //saves result of drop down into state by Question/ID number
  const handleResults = (e, index) => {
    console.log("handleResults -> questionList[index + 1]", questionList[index])
    let thisQ = "Q" + (index + 1);
    if (questionList[index].condition.hospitals.includes(hospital) && questionList[index].condition.invalidSelection.includes(e.target.value)) {
      alert('invalid ' + thisQ) //TODO:
    }
    setResults({ ...result, [thisQ]: e.target.value });
    console.log(result, result.Q17);
  };

  const handleSubmit = (e) => {
    //change questions length depend on hospital name
    var sum = questionList.length - 1;

    //change questions length depend on gender
    if (gender == "Male") {
      sum = sum - 1;
    }

    Object.keys(result).forEach(function (key) {
      // Decrease the sum if the user answer the question

      if (result[key] !== `${t("questionnaire.select")}`) {
        sum--;
      }
      // setComplete(true)
    });
    console.log("sum is", sum);

    if (sum === 0 && result.Q17 === `${t("questionnaire.confirm")}`) {
      setComplete(true);
      var appointId = localStorage.getItem("appointmentId");
      var userId = localStorage.getItem("userid");
      db.collection("Appointments").doc(appointId).update({
        userID: userId,
      });
      console.log(appointId, userId);
      history.push("/verfication");

      // Dont allow the user to go forward without accepting the terms
    } else if (result.Q17 !== `${t("questionnaire.confirm")}`) {
      alert("You have to confirm truth statement in order to proceed with your appointment");
    } else {
      // Validation if the user answer all of the questions
      alert("you need to answer all questions before you can submit the questionnare");
    }
    e.preventDefault();
  };

  useEffect(() => {
    setHospital(localStorage.getItem("hospital"));
    setGender(localStorage.getItem("gender"));
  }, []);

  return (
    <div
      style={{ textAlign: languageSelected === "en" ? "left" : "right" }}
      className="questionnairePage"
    >
      <div className="qIcon">
        <img src={qIcon} />
        <div className="highlight pageTitle">{t("screens.questionnaire")}</div>
        <span id="questionnaireSpan">
          {t("questionnaire.questionnaireSpan")}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        {(languageSelected === "en" ? questionList : questionListHeb).map(
          (question, index) =>
            //Questionairee Logic
            gender == "Male" && question.id == 14 ? (
              <div></div>
            ) : (
                <div
                  className={`${
                    languageSelected === "en" ? "questions" : "questionsRtl"
                    }`}
                >
                  <div
                    className={`${
                      languageSelected === "en" ? "left" : "leftRtl"
                      }`}
                  >
                    <div>
                      <b>{question.question} </b>
                    </div>
                  </div>

                  <div
                    className={`${
                      languageSelected === "en" ? "right" : "rightRtl"
                      }`}
                  >
                    {question.id == 4 || question.id == 15 ? (
                      <Fragment>
                        <select
                          class="dropdown"
                          onChange={(e) => handleResults(e, index)}
                        >
                          <option disabled="disabled" selected="selected">
                            {t("questionnaire.select")}
                          </option>
                          {question.options.map((option) => (
                            <option>{option}</option>
                          ))}
                        </select>
                      </Fragment>
                    ) : (
                        <Fragment>
                          <radiogroup>
                            {question.options.map((option) => (
                              <label>
                                <input
                                  type="radio"
                                  class="options"
                                  id={index + "@" + option}
                                  value={option}
                                  name={`Question${index}`}
                                  // onClick={() => checkedAnswers.push(index+'@'+option)}
                                  onChange={(e) => {
                                    handleResults(e, index);
                                    // handleChecked(question, index, option)
                                  }}
                                />
                                {" " + option}
                              </label>
                            ))}
                          </radiogroup>
                        </Fragment>
                      )}
                  </div>
                </div>
              )
        )}
        <div className="submit">
          <Button type="submit" text={t("questionnaire.submit")}></Button>
        </div>
      </form>
    </div>
  );
}
