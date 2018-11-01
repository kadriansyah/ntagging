
class Alo::QuestionForm
    include ActiveModel::Model

    attr_accessor(:id, :title, :question_text, :question_tag)

    # Validations
    validates :title, presence: true
    validates :question_text, presence: true

    def save
        if valid?
            question = Alo::Question.new(title: self.title, question_text: self.question_text, question_tag: self.question_tag)
            question.save
            true
        else
            false
        end
    end

    def update
        if valid?
            question = Alo::Question.find(self.id)
            question.update_attributes!(title: self.title, question_text: self.question_text, question_tag: self.question_tag)
            true
        else
            false
        end
    end
end
