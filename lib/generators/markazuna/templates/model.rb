require 'markazuna/common_model'

class <%= class_name %>
	include Mongoid::Document
    include Markazuna::CommonModel
    store_in collection: '<%= plural_name %>'

    # kaminari page setting
    paginates_per 20
	<%
	@fields.each_with_index do |field, index|
        next if index == 0
    %>
    field :<%= field %>, type: String, default: ''
	<%
	end
	%>
end
