require_dependency 'markazuna/di_container'

class Admin::UsersController < ApplicationController
    include Markazuna::INJECT['admin_service']

    # http://api.rubyonrails.org/classes/ActionController/ParamsWrapper.html
    wrap_parameters :core_user, include: [:id, :email, :username, :password, :confirmation_password, :firstname, :lastname]

    def index
        core_users, page_count = admin_service.find_users(params[:page])
        if (core_users.size > 0)
            respond_to do |format|
                format.json { render :json => { results: core_users, count: page_count }}
            end
        else
            render :json => { results: []}
        end
    end

    def delete
        status, page_count = admin_service.delete_user(params[:id])
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
        user_form = Admin::UserForm.new(user_form_params)
        if admin_service.create_user(user_form)
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
        core_user = admin_service.find_user(id)

        # # change id as string not oid
        # core_user = core_user.as_json(:except => :_id).merge('id' => core_user.id.to_s)
        if core_user
            respond_to do |format|
                format.json { render :json => { status: "200", payload: core_user } }
            end
        else
            respond_to do |format|
                format.json { render :json => { status: "404", message: "Failed" } }
            end
        end
    end

    def update
        user_form = Admin::UserForm.new(user_form_params)
        if admin_service.update_user(user_form)
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
    def user_form_params
        params.require(:core_user).permit(:id, :email, :username, :password, :confirmation_password, :firstname, :lastname)
        # params.require(:core_user).permit! # allow all
    end
end
