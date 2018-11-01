require_dependency 'moslemcorners/di_container'

class Alo::TagController < ApplicationController
    include MoslemCorners::INJECT['tag_service']

    # http://api.rubyonrails.org/classes/ActionController/ParamsWrapper.html
    wrap_parameters :tag, include: [:id, :name, :value, :css]

    def index
        tags, page_count = tag_service.find_tags(params[:page])
        if (tags.size > 0)
            respond_to do |format|
                format.json { render :json => { results: tags, count: page_count }}
            end
        else
            render :json => { results: []}
        end
    end

    def delete
        status, page_count = tag_service.delete_tag(params[:id])
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
        tag_form = Alo::TagForm.new(tag_form_params)
        if tag_service.create_tag(tag_form)
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
        tag = tag_service.find_tag(id)

        if tag
            respond_to do |format|
                format.json { render :json => { status: "200", payload: tag } }
            end
        else
            respond_to do |format|
                format.json { render :json => { status: "404", message: "Failed" } }
            end
        end
    end

    def update
        tag_form = Alo::TagForm.new(tag_form_params)
        if tag_service.update_tag(tag_form)
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
    def tag_form_params
        params.require(:tag).permit(:id, :name, :value, :css)
        # params.require(:core_user).permit! # allow all
    end
end