module Admin
    class AdminService
        def create_user(user_form)
            user_form.save
        end

        def update_user(user_form)
            user_form.update
        end

        def delete_user(id)
            core_user = find_user(id)
            core_user.delete
        end

        def find_user(id)
            Admin::CoreUser.find(id)
        end

        def find_users(page = 0)
            Admin::CoreUser.page(page)
        end

        # def create_account(username, password, provider)
        #     account_form = Admin::AccountForm.new(username: username, password: password, provider: provider)
        #     account_form.save
        # end
    end
end
