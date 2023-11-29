import React, { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";
import QuestionForm from "./QuestionForm";
function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/questions')
      .then(res => res.json())
      .then(questions => {
        setQuestions(questions)
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }, [])

  function handleQuestionAdded (newQuestion) {
    
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };
  function handleDeleteQuestion(questionId) {
    // Send a DELETE request to the API
    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        // Remove the deleted question from the state
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question.id !== questionId)
          
        );
        setSelectedQuestionId(null);
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  }
  function handleCorrectIndexChange(e) {
    const { value } = e.target;
    if (selectedQuestionId) {
      // Send a PATCH request to the API
      fetch(`http://localhost:4000/questions/${selectedQuestionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correctIndex: parseInt(value, 10),
        }),
      })
        .then((res) => res.json())
        .then((updatedQuestion) => {
          // Update state with the updated question
          setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
              question.id === updatedQuestion.id ? updatedQuestion : question
            )
          );
        })
        .catch((error) => {
          console.error("Error updating correct index:", error);
        });
    };


    ;

  }

  function handleViewQuestions (questionId)  {
    
    setSelectedQuestionId(questionId);
    
     }
  // function handleCorrectIndexChange (questionId, newCorrectIndex) {
  //   setQuestions((prevQuestions) => {
  //     const updatedQuestions = prevQuestions.map((question) => {
  //       if (question.id === questionId) {
  //         return {
  //           ...question,
  //           correctIndex: newCorrectIndex
  //         };
  //       }
  //       return question;
  //     });
  //     return updatedQuestions;
  //   });
  // }; 
  return (
    <section>
      <h1>Quiz Questions</h1>

      <ul> {questions.map((question) => <QuestionItem key={question.id} question={question} onViewQuestions={() => handleViewQuestions(question.id)} />)}</ul>

      <QuestionForm props={handleQuestionAdded} />
      {selectedQuestionId && (
        <div>
          <h2>Edit Correct Answer</h2>
          <label>
            Correct Answer Index:
            <select
              value={questions.find((q) => q.id === selectedQuestionId).correctIndex}
              onChange={handleCorrectIndexChange}
            >
              {Array.from({ length: questions.find((q) => q.id === selectedQuestionId).answers.length }, (_, index) => (
                <option key={index} value={index}>
                  {index}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
       {selectedQuestionId && (
        <div>
          <button onClick={() => handleDeleteQuestion(selectedQuestionId)}>
            Delete Question
          </button>
        </div>
      )}
    </section>
  );
}

export default QuestionList;
