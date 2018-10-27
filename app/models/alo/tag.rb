require 'moslemcorners/common_model'

class Alo::Tag
	include Mongoid::Document
    include MoslemCorners::CommonModel
    store_in collection: 'tags'

    # kaminari page setting
    paginates_per 20
	
    field :name, type: String, default: ''
	
    field :description, type: String, default: ''
	
end
