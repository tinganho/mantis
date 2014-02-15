
page('/home')

  /**
   * Titles and description is stored in an page -> array 
   * of titles and description object
   */

  .document('default', {
    title : 'some-title',
    description : 'some-description'
  })

  /**
   * Each layout has it own bundle of modules.
   */

  .layout('one-column')
  .modules({
    'feed-container' : {
      model : Feed, 
      view : FeedView
    },
    'menu-container' : {
      model : Menu, 
      view : MenuView
    }
  });