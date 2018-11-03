Rails.application.routes.draw do

    devise_for :core_user,
                class_name: 'Admin::CoreUser',
                module: :devise,
                path: 'admin',
                path_names: { 
                   sign_in: 'login',
                   sign_out: 'logout'
                },
               :controllers => {
                   sessions: 'admin/core_user/sessions',
                   registrations: 'admin/core_user/registrations',
                   passwords: 'admin/core_user/passwords'
               }

    root to: 'index#index'

    scope :admin do
        root to: 'admin#index', :as => "admin"
        get 'page/:name', to: 'admin#page'

        resources :users, controller: 'admin/users' do
            get 'delete', on: :member # http://guides.rubyonrails.org/routing.html#adding-more-restful-actions
        end

        resources :tags, controller: 'alo/tags' do
            get 'delete', on: :member # http://guides.rubyonrails.org/routing.html#adding-more-restful-actions
        end

        resources :questions, controller: 'alo/questions' do
            get 'delete', on: :member # http://guides.rubyonrails.org/routing.html#adding-more-restful-actions
        end
    end
end