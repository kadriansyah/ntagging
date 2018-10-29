
class Alo::QuestionService
    def create_question(question_form)
        question_form.save
    end

    def update_question(question_form)
        question_form.update
    end

    def delete_question(id)
        question = find_question(id)
        return question.delete, Alo::Question.page(1).total_pages
    end

    def find_question(id)
        Alo::Question.find(id)
    end

    def find_questions(page = 0)
        return Alo::Question.page(page), Alo::Question.page(1).total_pages
    end
end
