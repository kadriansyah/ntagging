<%%= javascript_pack_tag '<%= @component_path %>/<%= plural_name %>', defer: true %>
<<%= plural_name %>-page form-authenticity-token="<%%= form_authenticity_token.to_s %>"></<%= plural_name %>-page>