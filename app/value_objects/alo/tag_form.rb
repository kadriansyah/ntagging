
class Alo::TagForm
    include ActiveModel::Model

    attr_accessor(:id, :name, :description)

    # Validations
    
    validates :name, presence: true
    
    validates :description, presence: true
    

    def save
        if valid?
            tag = Alo::Tag.new(name: self.name, description: self.description)
            tag.save
            true
        else
            false
        end
    end

    def update
        if valid?
            tag = Alo::Tag.find(self.id)
            tag.update_attributes!(name: self.name, description: self.description)
            true
        else
            false
        end
    end
end
