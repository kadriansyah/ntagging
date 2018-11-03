require 'markazuna/common_model'
<%
    if namespaced?
        generated_class_name = "#{namespace.capitalize}::#{class_name}"
    else
        generated_class_name = "#{class_name}"
    end
%>
class <%= generated_class_name %>
	include Mongoid::Document
    include Markazuna::CommonModel
    store_in collection: '<%= plural_name %>'

    # kaminari page setting
    paginates_per 10
	<%
	@fields.each_with_index do |field, index|
        next if index == 0
    %>
    field :<%= field %>, type: String, default: ''
	<%
	end
	%>
end
