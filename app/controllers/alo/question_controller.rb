require_dependency 'moslemcorners/di_container'

class Alo::QuestionController < ApplicationController
    include MoslemCorners::INJECT['question_service']

    # http://api.rubyonrails.org/classes/ActionController/ParamsWrapper.html
    wrap_parameters :question, include: [:id, :title, :question_text, :question_tag, :question_label, :metadata]

    def index
        questions, page_count = question_service.find_questions(params[:page])
        if (questions.size > 0)
            respond_to do |format|
                format.json { render :json => { results: questions, count: page_count }}
            end
        else
            render :json => { results: []}
        end
    end

    def delete
        status, page_count = question_service.delete_question(params[:id])
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
        question_form = Alo::QuestionForm.new(question_form_params)
        if question_service.create_question(question_form)
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
        question = question_service.find_question(id)

        if question
            respond_to do |format|
                format.json { render :json => { status: "200", payload: question } }
            end
        else
            respond_to do |format|
                format.json { render :json => { status: "404", message: "Failed" } }
            end
        end
    end

    def update
        question_form = Alo::QuestionForm.new(question_form_params)
        if question_service.update_question(question_form)
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
    def question_form_params
        params.require(:question).permit(:id, :title, :question_text, :question_tag, :question_label, :metadata)
        # params.require(:core_user).permit! # allow all
    end
end