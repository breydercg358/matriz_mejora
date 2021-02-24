$(document).ready(function(){

    $("#toggle").change(function(){
        if($(this).is(':checked')){
            $("#contrasena").attr("type", "text");
            $("#confirm_pwd").attr("type", "text");
        }else{
            $("#contrasena").attr("type", "password");
            $("#confirm_pwd").attr("type", "password");
        }
    });

/*    $(".toggle-password").click(function(){
        $(this).toggleClass("fa-eye fa-eye-slash");
        var input = $($(this).attr("toggle"));
        var title_text = $('#div_title').prop('title', 'Ocultar contraseñas');
        if (input.attr("type") == "password"){
            input.attr("type", "text");
            title_text.attr("title", "Ocultar contraseñas");
        }else{
            input.attr("type", "password");
            title_text.attr("title", "Mostrar contraseñas");
        }
    }); */

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });

    $('#sidebar').mCustomScrollbar({
        theme: "minimal"
    });

    $('#DataTableUsuarios').DataTable();
});