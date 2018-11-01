
class Alo::TagForm
    include ActiveModel::Model

    attr_accessor(:id, :name, :value, :css)

    # Validations
    validates :name, presence: true
    validates :value, presence: true
    validates :css, presence: true

    def save
        if valid?
            tag = Alo::Tag.new(name: self.name, value: self.value, css: self.css)
            tag.save
            true
        else
            false
        end
    end

    def update
        if valid?
            tag = Alo::Tag.find(self.id)
            tag.update_attributes!(name: self.name, value: self.value, css: self.css)
            true
        else
            false
        end
    end
end
