class ApplicationController < ActionController::Base
    before_action :authenticate_core_user!

    # Overwriting the sign_in redirect path method
    def after_sign_in_path_for(resource)
        Rails.application.routes.url_helpers.admin_path
    end

    # Overwriting the sign_out redirect path method
    def after_sign_out_path_for(resource_or_scope)
        Rails.application.routes.url_helpers.admin_path
    end
end
