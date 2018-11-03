require_dependency 'markazuna/di_container'
<%
    fields = ""
    for ii in 0..@fields.length-2 do
        fields = "#{fields}:#{@fields[ii]}, "
    end
    fields = "#{fields}:#{@fields[@fields.length-1]}"
%>
class <%= @class_name %>Controller < ApplicationController
    include Markazuna::INJECT['<%= @service_name %>']

    # http://api.rubyonrails.org/classes/ActionController/ParamsWrapper.html
    wrap_parameters :<%= singular_name %>, include: [<%= fields %>]

    def index
        <%= plural_name %>, page_count = <%= @service_name %>.find_<%= plural_name %>(params[:page])
        if (<%= plural_name %>.size > 0)
            respond_to do |format|
                format.json { render :json => { results: <%= plural_name %>, count: page_count }}
            end
        else
            render :json => { results: []}
        end
    end

    def delete
        status, page_count = <%= @service_name %>.delete_<%= singular_name %>(params[:id])
        if status
            respond_to do |format|
                format.json { render :json => { status: "200", count: page_count } }
            end
        else
            respond_to do |format|
                format.json { render :json => { status: "404", message: "Failed" } }
            end
        end
    end

    def create
        <%= singular_name %>_form = <%= class_name %>Form.new(<%= singular_name %>_form_params)
        if <%= @service_name %>.create_<%= singular_name %>(<%= singular_name %>_form)
            respond_to do |format|
                format.json { render :json => { status: "200", message: "Success" } }
            end
        else
            respond_to do |format|
                format.json { render :json => { status: "404", message: "Failed" } }
            end
        end
    end

    def edit
        id = params[:id]
        <%= singular_name %> = <%= @service_name %>.find_<%= singular_name %>(id)

        if <%= singular_name %>
            respond_to do |format|
                format.json { render :json => { status: "200", payload: <%= singular_name %> } }
            end
        else
            respond_to do |format|
                format.json { render :json => { status: "404", message: "Failed" } }
            end
        end
    end

    def update
        <%= singular_name %>_form = <%= class_name %>Form.new(<%= singular_name %>_form_params)
        if <%= @service_name %>.update_<%= singular_name %>(<%= singular_name %>_form)
            respond_to do |format|
                format.json { render :json => { status: "200", message: "Success" } }
            end
        else
            respond_to do |format|
                format.json { render :json => { status: "404", message: "Failed" } }
            end
        end
    end

    private

    # Using strong parameters
    def <%= singular_name %>_form_params
        params.require(:<%= singular_name %>).permit(<%= fields %>)
        # params.require(:core_user).permit! # allow all
    end
end