require 'markazuna/common_model'

class Alo::Question
	include Mongoid::Document
    include Markazuna::CommonModel
    store_in collection: 'questions'

    # kaminari page setting
    paginates_per 10
	
    field :title, type: String, default: ''
    field :question_text, type: String, default: ''
    field :question_tag, type: String, default: ''
    field :question_label, type: String, default: ''
    field :metadata, type: String, default: ''
end
