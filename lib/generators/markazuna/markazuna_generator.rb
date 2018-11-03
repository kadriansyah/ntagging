class MarkazunaGenerator < Rails::Generators::NamedBase
	source_root File.expand_path('templates', __dir__)

	class_option :service_name, type: :string, default: 'default_service'
	class_option :fields, type: :array, default: '[:id]'
	
	def generate_controller_files
		@service_name = options['service_name']
		@fields = options['fields']
		if class_path[0].nil?
			template "controller.rb", File.join("app/controllers", "#{plural_file_name}_controller.rb")
		else
			template "controller.rb", File.join("app/controllers/#{class_path[0]}", "#{plural_file_name}_controller.rb")
		end
	end

	def generate_model_files
		@service_name = options['service_name']
		@fields = options['fields']
		if class_path[0].nil?
			template "model.rb", File.join("app/models", "#{file_name}.rb")
		else
			template "model.rb", File.join("app/models/#{class_path[0]}", "#{file_name}.rb")
		end
	end

	def generate_service_files
		@service_name = options['service_name']
		@fields = options['fields']
		if class_path[0].nil?
			template "service.rb", File.join("app/services", "#{file_name}_service.rb")
		else
			template "service.rb", File.join("app/services/#{class_path[0]}", "#{file_name}_service.rb")
		end
	end

	def generate_value_object_files
		@service_name = options['service_name']
		@fields = options['fields']
		if class_path[0].nil?
			template "value_object.rb", File.join("app/value_objects", "#{file_name}_form.rb")
		else
			template "value_object.rb", File.join("app/value_objects/#{class_path[0]}", "#{file_name}_form.rb")
		end
	end

	def generate_component_files
		@service_name = options['service_name']
		@fields = options['fields']

		if class_path[0].nil?
			@url = "/#{plural_name}"
		else
			@url = "/#{class_path[0]}/#{plural_name}"
		end

		template "component.rb", File.join("app/javascript/packs", "#{plural_name}.js")
		template "component-page.rb", File.join("app/javascript/packs/components", "#{plural_name}-page.js")
		template "component-form.rb", File.join("app/javascript/packs/components", "#{singular_name}-form.js")
		template "component-list.rb", File.join("app/javascript/packs/components", "#{singular_name}-list.js")
		if class_path[0].nil?
			template "component-html.rb", File.join("app/views", "#{plural_name}.html.erb")
		else
			template "component-html.rb", File.join("app/views/#{class_path[0]}", "#{plural_name}.html.erb")
		end

		# routes
		if class_path[0].nil?
			insert_into_file 'config/routes.rb', before: /end\Z/ do <<-RUBY
	resources :#{plural_name}, controller: '#{plural_name}' do
		get 'delete', on: :member # http://guides.rubyonrails.org/routing.html#adding-more-restful-actions
	end
			RUBY
			end
		else
			insert_into_file 'config/routes.rb', before: /end\Z/ do <<-RUBY
	resources :#{plural_name}, controller: '#{class_path[0]}/#{plural_name}' do
		get 'delete', on: :member # http://guides.rubyonrails.org/routing.html#adding-more-restful-actions
	end
		RUBY
			end
		end

		# DI Container
		if class_path[0].nil?
			insert_into_file 'lib/moslemcorners/di_container.rb', after: "extend Dry::Container::Mixin\n" do <<-RUBY

		register '#{singular_name}_service' do
			#{singular_name.capitalize}Service.new
		end
		RUBY
			end
		else
			insert_into_file 'lib/moslemcorners/di_container.rb', after: "extend Dry::Container::Mixin\n" do <<-RUBY

		register '#{singular_name}_service' do
			#{class_path[0].capitalize}::#{singular_name.capitalize}Service.new
		end
		RUBY
			end
		end
    end
end