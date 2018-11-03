require 'markazuna/common_model'

class Alo::Tag
	include Mongoid::Document
    include Markazuna::CommonModel
    store_in collection: 'tags'

    # kaminari page setting
    paginates_per 20
	
    field :name, type: String, default: ''
    field :value, type: String, default: ''
    field :css, type: String, default: ''
end
