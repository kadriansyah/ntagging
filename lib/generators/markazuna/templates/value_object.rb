<%
    fields = ""
    for ii in 0..@fields.length-2 do
        fields = "#{fields}:#{@fields[ii]}, "
    end
    fields = "#{fields}:#{@fields[@fields.length-1]}"
    fields_self = ""
    for ii in 1..@fields.length-2 do
        fields_self = "#{fields_self}#{@fields[ii]}: self.#{@fields[ii]}, "
    end
    fields_self = "#{fields_self}#{@fields[@fields.length-1]}: self.#{@fields[@fields.length-1]}"
    if namespaced?
        generated_class_name = "#{namespace.capitalize}::#{class_name}"
    else
        generated_class_name = "#{class_name}"
    end
%>
class <%= generated_class_name %>Form
    include ActiveModel::Model

    attr_accessor(<%= fields %>)

    # Validations
    <%
    @fields.each_with_index do |field, index|
        next if index == 0
    %>
    validates :<%= field %>, presence: true
    <%
    end
    %>

    def save
        if valid?
            <%= singular_name %> = <%= generated_class_name %>.new(<%= fields_self %>)
            <%= singular_name %>.save
            true
        else
            false
        end
    end

    def update
        if valid?
            <%= singular_name %> = <%= generated_class_name %>.find(self.id)
            <%= singular_name %>.update_attributes!(<%= fields_self %>)
            true
        else
            false
        end
    end
end
