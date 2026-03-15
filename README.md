# MapLibreSidebar

Minimal reusable sidebar extracted for MapLibre projects.

## Attribution

This project includes code adapted from:

- noerw/leaflet-sidebar-v2: https://github.com/noerw/leaflet-sidebar-v2

Upstream lineage includes Turbo87 sidebar projects:

- https://github.com/Turbo87/sidebar-v2
- https://github.com/Turbo87/leaflet-sidebar

## Files

- `maplibreSidebar.js`: core sidebar behavior (tabs, panes, open/close/toggle, custom events)
- `maplibreSidebar.css`: base sidebar styles only (no project-specific photo/doc UI)
- `maplibreSidebar.php`: minimal markup template (can be used as plain HTML too), including two tab groups (`.sidebar-tabs-top` and `.sidebar-tabs-bottom`)

## Usage

Include CSS/JS and the markup in your page:

```html
<link rel="stylesheet" href="maplibreSidebar.css" />
<script src="maplibreSidebar.js"></script>
```

Then initialize:

```html
<script>
  const sidebar = new MaplibreSidebar({
    container: '#sidebar',
    position: 'left',
    map: map,       // optional MapLibre map instance
    autopan: false  // set true to adjust map padding when opening/closing
  });

  sidebar.open('home');
</script>
```

## Emitted Events

Events are dispatched from the sidebar container element:

- `maplibreSidebar:open`
- `maplibreSidebar:close`
- `maplibreSidebar:change`

## License Notes

- Adapted source (`leaflet-sidebar-v2`) is MIT licensed.
- Keep attribution to upstream projects when redistributing this repository.
- This repository should include an MIT-compatible license for your own additions.
