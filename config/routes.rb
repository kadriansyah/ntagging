Rails.application.routes.draw do

    devise_for :core_user, class_name: 'Admin::CoreUser', module: :devise,
               path: 'admin', path_names: { sign_in: 'login', sign_out: 'logout' },
               :controllers => {
                   sessions: 'admin/core_user/sessions',
                   registrations: 'admin/core_user/registrations',
                   passwords: 'admin/core_user/passwords'
               }

    root to: 'index#index'

    scope :admin do
        root to: 'admin#index'
        get 'page/:name', to: 'admin#page'

        resources :users, controller: 'admin/user' do
            get 'delete', on: :member # http://guides.rubyonrails.org/routing.html#adding-more-restful-actions
        end
    end
  
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
