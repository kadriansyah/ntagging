require_dependency 'markazuna/di_container'

class IndexController < ActionController::Base
    def index
        render html: 'Hello World'
    end
end
