require_dependency 'markazuna/di_container'

class AdminController < ApplicationController

    def index

    end

    def page
        case params[:name]
            when 'questions'
                render template: 'admin/questions'

            when 'tags'
                render template: 'alo/tags'

            when 'groups'
                render template: 'admin/groups'

            when 'users'
                render template: 'admin/users'
        end
    end
end
