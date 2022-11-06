import {types} from 'mobx-state-tree';
export const TplStore = types
  .model('Tpl', {
    id: types.identifier,
    icon: '',
    path: '',
    label: '',
    schema: types.frozen({})
  })
  .views(self => ({}))
  .actions(self => {
    function updateSchema(schema: any) {
      self.schema = schema;
    }

    return {
      updateSchema
    };
  });

export type ITplStore = typeof TplStore;
